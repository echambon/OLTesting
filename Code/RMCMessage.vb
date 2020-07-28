Public Class RMCMessage
    Public Property _id As String = "$__RMC"
    Public Property _time As Date = Now
    Public Property _status As Char = "A"
    Public Property _coordinates As Coordinates = New Coordinates
    Public Property _SOG As Double = 0
    Public Property _COG As Double = 0
    Public Property _mode As Char = "N"
End Class
