/*

Possible enhancements:
- 

*/

function test() {
  var ss = SpreadsheetApp.openById("");
  
  // Test editing the spreadsheet
  reconcileCalendar({
    range: ss.getDataRange()
  })
}

function reconcileCalendar(e) {
  Logger.log('Inside reconcileCalendar().')
  
  // Set variables:
  // Which calendar are we updating?
  var app = {
    onCallCalendarId: ''
  }

  // Get all of the non-empty date/person pairs
  app.sheetData = e.range.getSheet().getRange(2, 2, e.range.getSheet().getLastRow(), 2).getValues()

  var onCallData = []  
  for (r=0; r < app.sheetData.length; r++) {
    onCallData.push({
      date: app.sheetData[r][0],
      person: app.sheetData[r][1]
    })
  }
  
  // Clear out all existing events in the on-call calendar
  var eventsData = []
  var events = CalendarApp.getCalendarById(app.onCallCalendarId).getEvents(new Date('1900-01-01'), new Date('3000-12-31'))
  
  // Create new events using onCallData
  for (i=0; i < onCallData.length; i++) {
    // If the data is valid, create the event
    if (validateOnCallData(onCallData[i])) {
      Logger.log("onCallData[i] is %s", onCallData[i])
      Logger.log("formattedDateForCalendar(onCallData[i].date).getDate() is %s", formattedDateForCalendar(onCallData[i].date).getDate())
      var d = formattedDateForCalendar(onCallData[i].date)
      d.setDate(formattedDateForCalendar(onCallData[i].date).getDate() + 6)
      var endDate = d
      Logger.log("endDate is %s", endDate)
        var event = CalendarApp.getCalendarById(app.onCallCalendarId).createEvent(
          onCallData[i].person, 
          formattedDateForCalendar(onCallData[i].date), 
          endDate).getId()
        Logger.log(event)
    } else {
      Logger.log('Looks like the date is invalid: ' + validateOnCallData(onCallData[i]))
    }
  }
}

/*
 * What is this function doing exactly?
 */
function formattedDateForCalendar(date) {
  Logger.log('Inside formattedDateForCalendar(). . . .')
  
  // See if we got a valid date or if we got a column header or something else
  if (isValidDate(date)) {
    var newDate = new Date(date)
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset())
    Logger.log('Returning newDate: ' + newDate)
    return newDate
  }
  Logger.log("Looks like we didn't get a valid date: %s", date)
  return false
}

function validateOnCallData(data) {
  Logger.log('Inside validateOnCallData(). . . .')

  Logger.log('data is: ' + data)

  if (
    // Is the date a valid date?
    isValidDate(data.date)
  
  ) {
    return true
  }
  
  return false
}

function isValidDate(input) {
  if (!isNaN(input)) {
    return true
  }
  
  return false
}
