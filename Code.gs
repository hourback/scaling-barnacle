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
    , maxEvents: 200 // The maximum number of calendar events to create
  }

  // Get all of the non-empty date/person pairs
  app.sheetData = e.range.getSheet().getRange(2, 2, e.range.getSheet().getLastRow(), 6).getValues()

  var onCallData = []  
  for (r=0; r < app.sheetData.length; r++) {
    onCallData.push({
      date: app.sheetData[r][0],
      person: app.sheetData[r][1],
      desk: app.sheetData[r][2] + app.sheetData[r][3],
      mobile: app.sheetData[r][4],
      backup: app.sheetData[r][5],
    })
  }
  
  Logger.log("onCallData is %s", onCallData)
  
  // Clear out all existing events in the on-call calendar
  var events = CalendarApp.getCalendarById(app.onCallCalendarId).getEvents(new Date('1900-01-01'), new Date('3000-12-31'))
  for (i=0; i < events.length; i++) {
    events[i].deleteEvent()
  }
  
  // Create new events using onCallData
  for (i=0; i < onCallData.length && i < app.maxEvents; i++) {
    // If the data is valid, create the event
    if (validateOnCallData(onCallData[i])) {
      Logger.log("onCallData[i] is %s", onCallData[i])
      Logger.log("formattedDateForCalendar(onCallData[i].date).getDate() is %s", formattedDateForCalendar(onCallData[i].date).getDate())
      var d = formattedDateForCalendar(onCallData[i].date)
      d.setDate(formattedDateForCalendar(onCallData[i].date).getDate() + 6)
      var endDate = d
      Logger.log("endDate is %s", endDate)
      
      // This is the format of the calendar event title
      var eventTitle = "On call: " + onCallData[i].person + "/" + onCallData[i].backup
      
      var eventOptions = {
        description: onCallData[i].person + "\ndesk: " + onCallData[i].desk + "\nmobile: " + onCallData[i].mobile
      }
        
      var event = CalendarApp.getCalendarById(app.onCallCalendarId).createEvent(
          eventTitle 
          , formattedDateForCalendar(onCallData[i].date)
          , endDate
          , eventOptions).getId()
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
