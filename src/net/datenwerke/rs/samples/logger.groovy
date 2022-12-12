package net.datenwerke.rs.samples

import java.util.logging.Level
import java.util.logging.Logger
import net.datenwerke.rs.adminutils.service.logs.LogFilesService
import java.io.File
import java.util.regex.Matcher
import java.util.regex.Pattern
import java.nio.file.Paths
import groovy.json.JsonOutput;

/**
 * logger.groovy
 * Version: 1.0.1
 * Type: Normal script
 * Last tested with: ReportServer 4.0.0-6053
 * Prints output into the Tomcat ReportServer logs using different logging levels.
 * Depending on your log configuration, some log messages may/may not appear.
 * You can adapt the level in this file: logging-rs.properties
 * SEVERE messages should always appear, as SEVERE level is highest.
 * More information here: https://docs.oracle.com/javase/8/docs/api/java/util/logging/Level.html
 */

def logger = Logger.getLogger(getClass().name)

// ask reportserver to receive instance obj of the class LogFileService //
def logfileservice = GLOBALS.getInstance(LogFilesService.class)
/* Prefix for logger messages.
 * Allows to quickly find messages of this specific script */
def prefix = 'logger.groovy'
def curDir = logfileservice.getLogDirectory()
File folder = new File(curDir)
// logs all the files in the dir
File[] listOfFiles = folder.listFiles()
        tout.println('filelist ' + listOfFiles)

//  funtion to read the file content //

def readLogFile(file) {
 String fileContents = new File(file).text
 return JsonOutput.toJson(fileContents);
 //   tout.println("content: " + fileContents)
}

def getLatestFileOfEach(fileMap) {
def latestFileDates = [:]
fileMap.each{fileName, dates -> return  readLogFile(Paths.get(curDir, fileName, dates.last()).toString()) }
// tout.println("latestFileDates: " + latestFileDates) 

}

Pattern pattern = Pattern.compile(/(?<prefix>.*)(?<date>\d{4}-\d\d-\d\d).*/, Pattern.CASE_INSENSITIVE)

    def map = [:]
   
listOfFiles.each { file ->
    Matcher matcher = pattern.matcher(file.getName())
    tout.println('matcher: ' + matcher)
    boolean matchFound = matcher.find()    
    if (matchFound) {
        tout.print('Match found ' + matcher.group('prefix'))
        tout.println(matcher.group('date'))
        tout.println('values in map: ' + map.get(matcher.group('prefix')))
        //  map[matcher.group('prefix')] = matcher.group('date')
        if (map.containsKey(matcher.group('prefix'))) {
            // get the values of the map with the key of regex group "prefix" => the initial date array
            def dateVal = map.get(matcher.group('prefix'))
            //expand the array with the new dates
            dateVal.add(matcher.group('date'))
            // update the existing map
            map[matcher.group('prefix')] = dateVal
            tout.println('dateVal' + dateVal)
        } else {
            // when there is no content in the map, add an array containing the first observed date
            map[matcher.group('prefix')] = [matcher.group('date')]
        }
// get the content of the file
    getLatestFileOfEach(map)
   // readLogFile(Paths.get(curDir, file.getName()).toString())

    } else {
        tout.println('Match not found ' + file.getName())
    }
}



// tout.println('map out of loop: ' + map)
tout.println 'Executing logger.groovy'
tout.println 'log getLogDir ' + logfileservice.getLogDirectory()


//in descending order
logger.log(Level.SEVERE, "$prefix SEVERE-level message")
logger.log(Level.WARNING, "$prefix WARNING-level message")
logger.log(Level.INFO, "$prefix INFO-level message")
logger.log(Level.CONFIG, "$prefix CONFIG-level message")
logger.log(Level.FINE, "$prefix FINE-level message")
logger.log(Level.FINER, "$prefix FINER-level message")
logger.log(Level.FINEST, "$prefix FINEST-level message")
