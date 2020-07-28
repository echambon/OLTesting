Imports Newtonsoft.Json

Public Class JavaScriptInteractionObj
    Public Property _fullscreen As Boolean
    Public Property _fullscreenPrev As Boolean
    Public Property _validRMC As Boolean
    Public Property _userPosition As Coordinates
    Public Property _userHeading As Double
    Public Property _userSpeed As Double

    Public Sub New()
        _fullscreen = True
        _validRMC = False
        _userPosition = New Coordinates(-2.90171, 47.54101) ' Debug
        _userHeading = 0.0
        _userSpeed = 0.0
    End Sub

    Public Function GetUserPosition() As String
        Dim json As String = JsonConvert.SerializeObject(_userPosition)
        Return json
    End Function

    Public Function GetUserHeading() As String
        Dim json As String = JsonConvert.SerializeObject(_userHeading)
        Return json
    End Function

    Public Function GetUserSpeed() As String
        Dim json As String = JsonConvert.SerializeObject(_userSpeed)
        Return json
    End Function

    Public Function GetValidity() As String
        Dim json As String = JsonConvert.SerializeObject(_validRMC)
        Return json
    End Function

    Public Sub ToggleFormMainFullscreen()
        _fullscreenPrev = _fullscreen
        _fullscreen = Not _fullscreen
    End Sub
End Class
