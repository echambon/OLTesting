Public Module NMEAParser
    ' only sentences which prefix contains the characters below will be parsed
    Private Const ParsedSentencesPrefix As String = "RMC"

    Private Const INDEX_ID As Integer = 0
    Private Const INDEX_TIME As Integer = 1
    Private Const INDEX_STATUS As Integer = 2
    Private Const INDEX_LAT As Integer = 3
    Private Const INDEX_LAT_CARDINAL As Integer = 4
    Private Const INDEX_LON As Integer = 5
    Private Const INDEX_LON_CARDINAL As Integer = 6
    Private Const INDEX_SOG As Integer = 7
    Private Const INDEX_COG As Integer = 8
    Private Const INDEX_DATE As Integer = 9

    Public Function ParseToString(ByVal str As String) As String
        If str IsNot Nothing Then
            Dim searchIndex = str.IndexOf(ParsedSentencesPrefix)

            Try
                Dim CRLFIndex = str.IndexOf(Chr(13), searchIndex)
                Return str.Substring(searchIndex - 3, CRLFIndex)
            Catch
                Throw New ParsingException
            End Try
        End If
        Return Nothing
    End Function

    Public Function ParseToRMCMessage(ByVal str As String, ByVal previousMessage As RMCMessage) As RMCMessage
        Dim outMsg = New RMCMessage
        If previousMessage IsNot Nothing Then
            outMsg = previousMessage
        End If

        ' split string along , character
        Dim splitStr() As String = Split(str, ",")

        ' fill Id
        outMsg._id = splitStr(INDEX_ID)

        ' fill GPS time
        Try
            'outMsg._time = Date.ParseExact(splitStr(INDEX_DATE) + " " + splitStr(INDEX_TIME),
            '                              "ddMMyy HHmmss.ff", Nothing)
            outMsg._time = Date.ParseExact(splitStr(INDEX_DATE) + " " + splitStr(INDEX_TIME),
                                          "ddMMyy HHmmss", Nothing)
        Catch ex As FormatException
            'outMsg._time = Date.ParseExact("010170 120000.00", "ddMMyy HHmmss.ff", Nothing)
            outMsg._time = Date.ParseExact("010170 120000", "ddMMyy HHmmss", Nothing)
        End Try

        ' status
        outMsg._status = splitStr(INDEX_STATUS)

        ' latitude/longitude
        outMsg._coordinates = New Coordinates
        Try
            Dim latDegrees As String = splitStr(INDEX_LAT).Substring(0, 2)
            Dim latMinutes As String = splitStr(INDEX_LAT).Substring(2, splitStr(INDEX_LAT).Length - 2)
            Dim latCardinal As String = splitStr(INDEX_LAT_CARDINAL)

            Dim lonDegrees As String = splitStr(INDEX_LON).Substring(0, 3)
            Dim lonMinutes As String = splitStr(INDEX_LON).Substring(3, splitStr(INDEX_LON).Length - 3)
            Dim lonCardinal As String = splitStr(INDEX_LON_CARDINAL)

            outMsg._coordinates._latitude = CDbl(Val(latDegrees)) + CDbl(Val(latMinutes)) / 60
            Select Case latCardinal
                Case "N"
                    ' do nothing
                Case "S"
                    outMsg._coordinates._latitude = -outMsg._coordinates._latitude
            End Select

            outMsg._coordinates._longitude = CDbl(Val(lonDegrees)) + CDbl(Val(lonMinutes)) / 60
            Select Case lonCardinal
                Case "E"
                    ' do nothing
                Case "W"
                    outMsg._coordinates._longitude = -outMsg._coordinates._longitude
            End Select
        Catch ex As Exception
            outMsg._coordinates = New Coordinates
        End Try

        ' SOG
        Try
            outMsg._SOG = CDbl(Val(splitStr(INDEX_SOG)))
        Catch ex As Exception
            outMsg._SOG = 0
        End Try

        ' COG
        Try
            If splitStr(INDEX_COG).Length > 0 Then
                outMsg._COG = CDbl(Val(splitStr(INDEX_COG)))
            Else
                ' do nothing (previous message saved)
            End If
        Catch ex As Exception
            ' do nothing (previous message saved)
        End Try

        Return outMsg
    End Function
End Module
