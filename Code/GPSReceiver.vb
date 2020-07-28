Imports System.IO

Public Class GPSReceiver
    Private p_IsConnected As Boolean = False
    Public ReadOnly Property _isConnected As Boolean
        Get
            Return p_IsConnected
        End Get
    End Property
    Private p_readTimeout As Integer = DEFAULT_COM_READTIMEOUT
    Private p_serialPort As Ports.SerialPort
    Private p_serialData As String
    Public ReadOnly Property _data As String
        Get
            Return p_serialData
        End Get
    End Property
    Public Property _baudRate As Integer = DEFAULT_COM_BAUDRATE
    Public Property _COMPort As String = DEFAULT_COM_PORT
    Public Property _errorMessage As String = Nothing
    Public Property _RMCMessage As RMCMessage = Nothing
    Private Const SERIAL_DISCONNECTED_RETRY_THREAD_PERIOD_S As Integer = FormMain.SERIAL_DISCONNECTED_RETRY_THREAD_PERIOD / 1000

    Public Sub New(ByVal serialPort As PreferencesItem, ByVal baudrate As PreferencesItem, ByVal readTimeout As PreferencesItem)
        _COMPort = serialPort._value
        _baudRate = baudrate._value
        p_readTimeout = readTimeout._value
        p_serialPort = Nothing
        p_serialData = ""

        ' try opening port
        Me.OpenPort()
    End Sub

    Public Sub OpenPort()
        Try
            p_serialPort = My.Computer.Ports.OpenSerialPort(_COMPort)
            p_serialPort.ReadTimeout = p_readTimeout
            p_serialPort.BaudRate = _baudRate
            p_serialPort.DiscardInBuffer()
            p_serialPort.DiscardOutBuffer()
            p_IsConnected = True
        Catch ex As IOException
            ' COM port does not exist
            _errorMessage = "port not found, retrying in " + SERIAL_DISCONNECTED_RETRY_THREAD_PERIOD_S.ToString + "s"
        Catch ex As TimeoutException
            ' Timeout
            _errorMessage = "timeout error, retrying in " + SERIAL_DISCONNECTED_RETRY_THREAD_PERIOD_S.ToString + "s"
        Catch ex As UnauthorizedAccessException
            ' Port alreay opened by another application
            _errorMessage = "port opened in another application, retrying in " + SERIAL_DISCONNECTED_RETRY_THREAD_PERIOD_S.ToString + "s"
        End Try
    End Sub

    Public Sub ClosePort()
        If p_serialPort IsNot Nothing Then
            p_serialPort.Close()
            p_IsConnected = False
        End If
    End Sub

    Public Sub ReceiveSerialData()
        If p_IsConnected Then
            Try
                Dim incomingData As String = ParseToString(p_serialPort.ReadExisting)
                Dim incomingRMC As RMCMessage = ParseToRMCMessage(incomingData, _RMCMessage)

                If incomingData IsNot Nothing Then
                    p_serialData = incomingData
                    _RMCMessage = incomingRMC
                    _errorMessage = Nothing
                End If
            Catch ex As TimeoutException
                ClosePort()
                _errorMessage = "timeout error, retrying in " + SERIAL_DISCONNECTED_RETRY_THREAD_PERIOD_S.ToString + "s"
                ' Timeout
            Catch ex As IOException
                ClosePort()
                _errorMessage = "serial port error, retrying in " + SERIAL_DISCONNECTED_RETRY_THREAD_PERIOD_S.ToString + "s"
                ' Receiver (probably) disconnected
            Catch ex As ParsingException
                ClosePort()
                _errorMessage = "parsing exception, retrying in " + SERIAL_DISCONNECTED_RETRY_THREAD_PERIOD_S.ToString + "s"
            End Try
        End If
    End Sub
End Class
