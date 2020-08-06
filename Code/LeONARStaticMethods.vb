Imports System.IO
Imports System.Reflection
Imports CefSharp
Imports CefSharp.WinForms

Public Class LeONARStaticMethods
    Private Shared _assembly As Assembly = Assembly.GetExecutingAssembly()

    Public Shared Function GetBrowser() As ChromiumWebBrowser
        Dim result As ChromiumWebBrowser = New ChromiumWebBrowser("http://rendering")
        result.RegisterResourceHandler("http://rendering/css/tooltip.css", GetStreamResource("OLTesting.tooltip.css"), "text/css")
        result.RegisterResourceHandler("http://rendering/css/popup.css", GetStreamResource("OLTesting.popup.css"), "text/css")
        result.RegisterResourceHandler("http://rendering/css/ol.css", GetStreamResource("OLTesting.ol.css"), "text/css")
        result.RegisterResourceHandler("http://rendering/js/ol.js", GetStreamResource("OLTesting.ol.js"), "text/javascript")
        result.RegisterResourceHandler("http://rendering/js/jquery.js", GetStreamResource("OLTesting.jquery-3.5.1.min.js"), "text/javascript")
        result.RegisterResourceHandler("http://rendering/js/xml2json.js", GetStreamResource("OLTesting.jquery.xml2json.js"), "text/javascript")
        result.RegisterResourceHandler("http://rendering/css/mapstyle.css", GetStreamResource("OLTesting.mapstyle.css"), "text/css")
        result.RegisterResourceHandler("http://rendering/js/helpers.js", GetStreamResource("OLTesting.helpers.js"), "text/javascript")
        result.RegisterResourceHandler("http://rendering/js/events.js", GetStreamResource("OLTesting.events.js"), "text/javascript")
        result.RegisterResourceHandler("http://rendering/js/controls.js", GetStreamResource("OLTesting.controls.js"), "text/javascript")
        result.RegisterResourceHandler("http://rendering/js/leonar.js", GetStreamResource("OLTesting.leonar.js"), "text/javascript")
        result.RegisterResourceHandler("http://rendering/js/LObject.js", GetStreamResource("OLTesting.LObject.js"), "text/javascript")

        result.RegisterResourceHandler("http://rendering/img/iconShip.png", GetStreamResource("OLTesting.iconShip.png"), "image/png")
        result.RegisterResourceHandler("http://rendering/img/iconGlobe.png", GetStreamResource("OLTesting.iconGlobe.png"), "image/png")
        result.RegisterResourceHandler("http://rendering/img/iconGraticule.png", GetStreamResource("OLTesting.iconGraticule.png"), "image/png")
        result.RegisterResourceHandler("http://rendering/img/iconMouse.png", GetStreamResource("OLTesting.iconMouse.png"), "image/png")
        result.RegisterResourceHandler("http://rendering/img/iconSatellite.png", GetStreamResource("OLTesting.iconSatellite.png"), "image/png")
        result.RegisterResourceHandler("http://rendering/img/iconSpeed.png", GetStreamResource("OLTesting.iconSpeed.png"), "image/png")
        result.RegisterResourceHandler("http://rendering/img/iconHeading.png", GetStreamResource("OLTesting.iconHeading.png"), "image/png")
        result.RegisterResourceHandler("http://rendering/img/iconFullscreen.png", GetStreamResource("OLTesting.iconFullscreen.png"), "image/png")
        result.RegisterResourceHandler("http://rendering/img/iconUserPosition.png", GetStreamResource("OLTesting.iconUserPosition.png"), "image/png")
        result.RegisterResourceHandler("http://rendering/img/iconStart.png", GetStreamResource("OLTesting.iconStart.png"), "image/png")
        result.RegisterResourceHandler("http://rendering/img/iconPause.png", GetStreamResource("OLTesting.iconPause.png"), "image/png")

        Return result
    End Function

    Public Shared Function GetStreamResource(ByVal name As String) As Stream
        Return _assembly.GetManifestResourceStream(name)
    End Function

    Public Shared Function GetStringResource(ByVal name As String) As String
        Dim text As String = String.Empty
        Using reader As New StreamReader(_assembly.GetManifestResourceStream(name))
            text = reader.ReadToEnd()
        End Using
        Return text
    End Function
End Class
