Imports System.Text
Imports System.Threading
Imports CefSharp
Imports CefSharp.WinForms

Public Class FormMain
    Private Const UI_UPDATE_THREAD_PERIOD As Integer = 500
    Private Const SERIAL_DATA_RECEIVE_THREAD_PERIOD As Integer = 1000
    Public Const SERIAL_DISCONNECTED_RETRY_THREAD_PERIOD As Integer = 5000

    Public Property Settings As CefSettings
    Public Property Browser As ChromiumWebBrowser
    Public Property JSInterface As JavaScriptInteractionObj

    Private Property UIUpdateThread As Thread
    Private Property ReceiveSerialDataThread As Thread
    Private Property AppUserPreferences As UserPreferences
    Private Property AppGPSReceiver As GPSReceiver

    Private Delegate Sub UIUpdate_Delegate()
    Private Delegate Sub ReceiveSerialData_Delegate()

    Private Sub UIUpdate_ThreadFunction()
        While True
            Invoke(New UIUpdate_Delegate(AddressOf ToggleFullscreen))
            Thread.Sleep(UI_UPDATE_THREAD_PERIOD)
        End While
    End Sub

    Public Sub ToggleFullscreen()
        If JSInterface._fullscreen <> JSInterface._fullscreenPrev Then
            If Not JSInterface._fullscreen Then
                WindowState = WindowState.Normal ' avoids bug when form has been maximized previously
                FormBorderStyle = FormBorderStyle.None
                WindowState = WindowState.Maximized
            Else
                FormBorderStyle = FormBorderStyle.Sizable
                WindowState = WindowState.Normal
            End If
            JSInterface._fullscreenPrev = JSInterface._fullscreen
        End If
    End Sub

    Private Sub ReceiveSerialData_ThreadFunction()
        While True
            ' receive serial data
            Invoke(New ReceiveSerialData_Delegate(AddressOf ReceiveSerialData))

            ' force validity to false if GPSReceiver is not connected
            If Not AppGPSReceiver._isConnected Then
                JSInterface._validRMC = False
            End If

            ' execute JS loop function
            If Browser.CanExecuteJavascriptInMainFrame And Not Browser.IsLoading Then
                Browser.ExecuteScriptAsync("loop();")
            End If

            If Not AppGPSReceiver._isConnected Then
                ' retry connecting
                AppGPSReceiver.OpenPort()

                ' wait before next retry
                Thread.Sleep(SERIAL_DISCONNECTED_RETRY_THREAD_PERIOD - SERIAL_DATA_RECEIVE_THREAD_PERIOD)
            End If

            ' put thread to sleep
            Thread.Sleep(SERIAL_DATA_RECEIVE_THREAD_PERIOD)
        End While
    End Sub

    Public Sub ReceiveSerialData()
        If AppGPSReceiver._isConnected Then
            AppGPSReceiver.ReceiveSerialData()
            If AppGPSReceiver._RMCMessage IsNot Nothing Then ' AndAlso AppGPSReceiver._RMCMessage._status = "A"
                JSInterface._userPosition = AppGPSReceiver._RMCMessage._coordinates
                JSInterface._userHeading = AppGPSReceiver._RMCMessage._COG
                JSInterface._userSpeed = AppGPSReceiver._RMCMessage._SOG
                If AppGPSReceiver._RMCMessage._status = "A" Then
                    JSInterface._validRMC = True
                End If
            End If
        End If
    End Sub

    Public Sub New()
        InitializeComponent()
        CefSharp.Cef.EnableHighDPISupport()
    End Sub

    Private Sub FormMain_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        ' Set form title
        Text = "LeONAR"

        ' Init preferences
        AppUserPreferences = New UserPreferences

        ' Init GPS Receiver
        AppGPSReceiver = New GPSReceiver(AppUserPreferences.GetPreferencesByName("SerialPort"),
                                         AppUserPreferences.GetPreferencesByName("SerialBaudrate"),
                                         AppUserPreferences.GetPreferencesByName("SerialTimeout"))

        ' Init JS interface object and browser
        JSInterface = New JavaScriptInteractionObj()
        InitBrowser()

        ' Init threads
        UIUpdateThread = New Thread(AddressOf UIUpdate_ThreadFunction)
        UIUpdateThread.Start()
        ReceiveSerialDataThread = New Thread(AddressOf ReceiveSerialData_ThreadFunction)
        ReceiveSerialDataThread.Start()
    End Sub

    Private Sub FormMain_FormClosing(sender As Object, e As FormClosingEventArgs) Handles Me.FormClosing
        'CefSharp.Cef.Shutdown() ' slows down everything
        UIUpdateThread.Abort()
        ReceiveSerialDataThread.Abort()
    End Sub

    Private Sub InitBrowser()
        ' initialize Cef component
        Settings = New CefSettings
        Settings.CachePath = Application.UserAppDataPath
        CefSharp.Cef.Initialize(Settings)

        Dim html As String = LeONARStaticMethods.GetStringResource("OLTesting.map.html")
        Browser = LeONARStaticMethods.GetBrowser()
        Browser.Dock = DockStyle.Fill

        ' attach JS-VB.NET interaction object
        CefSharpSettings.LegacyJavascriptBindingEnabled = True
        CefSharpSettings.WcfEnabled = True
        Browser.JavascriptObjectRepository.Register("winformObj", JSInterface, False)

        ' load page
        Browser.LoadHtml(html, "http://rendering", Encoding.UTF8)

        ' add control to Form
        Controls.Add(Browser)
    End Sub
End Class
