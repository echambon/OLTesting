Public Class Coordinates
    Public Property _latitude As Double
    Public Property _longitude As Double

    Public Sub New(ByVal longitude As Double, ByVal latitude As Double)
        _latitude = latitude
        _longitude = longitude
    End Sub

    Public Sub New()
        Me.New(0.0, 0.0)
    End Sub
End Class
