Public Class PreferencesItem
    Public Property _name As String
    Public Property _value As Object

    Public Sub New()
        Me.New("nothing", Nothing)
    End Sub

    Public Sub New(ByVal name As String, ByVal value As Object)
        _name = name
        _value = value
    End Sub
End Class
