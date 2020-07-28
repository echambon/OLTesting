Imports System.IO
Imports System.Xml.Serialization

Public Class UserPreferences
    Private Const APP_DATA_FILENAME As String = "Preferences.xml"
    Private _preferencesItem As List(Of PreferencesItem)
    Private _defaultPreferencesItem As List(Of PreferencesItem)
    Private _appDataXML As String
    Private _fileReader As StreamReader

    Private Sub WriteXMLFile()
        Dim serializer As New XmlSerializer(GetType(List(Of PreferencesItem)))
        Dim fileWrite As New StreamWriter(_appDataXML)
        serializer.Serialize(fileWrite, _preferencesItem)
        fileWrite.Close()
    End Sub

    Private Sub DefaultPreferences()
        ' Default TilesCachePath value
        _defaultPreferencesItem.Add(New PreferencesItem("SerialPort", DEFAULT_COM_PORT))
        _defaultPreferencesItem.Add(New PreferencesItem("SerialBaudrate", DEFAULT_COM_BAUDRATE))
        _defaultPreferencesItem.Add(New PreferencesItem("SerialTimeout", DEFAULT_COM_READTIMEOUT))

        ' Copy default preferences to actual preferences
        _preferencesItem = _defaultPreferencesItem.ToList()
    End Sub

    Public Function GetPreferencesByName(ByVal name As String) As PreferencesItem
        Dim output As PreferencesItem = New PreferencesItem
        output = _defaultPreferencesItem.Find(Function(x) x._name = name)

        ' in case item is missing in the preferences file
        If output Is Nothing Then
            ' load default preference
            output = _defaultPreferencesItem.Find(Function(x) x._name = name)

            ' add default preference to preferences items list
            _preferencesItem.Add(output)

            ' overwrite existing preferences file to make missing item appear
            Me.WriteXMLFile()
        End If
        Return output
    End Function

    Public Sub New()
        ' initialize object
        _preferencesItem = New List(Of PreferencesItem)
        _defaultPreferencesItem = New List(Of PreferencesItem)

        ' initialize preferences
        Me.DefaultPreferences()

        ' XML preferences file path
        _appDataXML = Application.UserAppDataPath + Path.DirectorySeparatorChar + APP_DATA_FILENAME

        Try
            _fileReader = New StreamReader(_appDataXML)
            Dim deserializer As New XmlSerializer(GetType(List(Of PreferencesItem)))
            _preferencesItem = deserializer.Deserialize(_fileReader)
            _fileReader.Close()
        Catch ex As FileNotFoundException
            ' file does not exist, create it
            ' save to XML files
            Me.WriteXMLFile()
        Catch ex As InvalidOperationException
            ' XML file is corrupt
            ' close filereader to allow overwriting
            _fileReader.Close()

            ' overwrite existing corrupt XML file
            Me.WriteXMLFile()
        End Try
    End Sub
End Class
