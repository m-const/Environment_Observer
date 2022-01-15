'use strict';
require('dotenv').config();
module.exports = class Logger {

    constructor() {
        this.seperator = " - "
        this.environment = process.env.NODE_ENV || 'production'
        this.defaultLevel = parseInt(process.env.LOGGER_DEFAULT_LEVEL) || 0
    }

    _colorConsole(severity, str) {
        //colour console logs based on severity
        let colourMapping = []
        colourMapping[0] = "\x1b[36m"
        colourMapping[1] = "\x1b[35m"
        colourMapping[2] = "\x1b[33m"
        colourMapping[3] = "\x1b[31m"
        /**
         * FgRed = "\x1b[31m"
         * FgGreen = "\x1b[32m"
         * FgYellow = "\x1b[33m"
         * FgBlue = "\x1b[34m"
         * FgMagenta = "\x1b[35m"
         * FgCyan = "\x1b[36m"
         * FgWhite = "\x1b[37m
         * Dim = "\x1b[2m"
        */
        return `${colourMapping[severity]}${str}\x1b[0m`

    }

    _consoleLogger(severity, logMsg) {



        if (this.environment == 'development') {
            console.log(this._colorConsole(severity, logMsg))
        }
    }
    _severityTags(severity) {
        const validSeverity = {};
        validSeverity[0] = 'INFO'
        validSeverity[1] = 'WARN'
        validSeverity[2] = 'ERROR'
        validSeverity[3] = 'FATAL ERROR'
        return validSeverity[severity]
    }

    _getTimestamp() {
        const returnDate = new Date()

        return returnDate.toLocaleDateString('en', { year: 'numeric', month: 'numeric', day: 'numeric', hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' })
    }

    

    _logRouter(severity, msg) {
        //this method handels the creation and writing of log files and concole logging
        this._consoleLogger(severity, msg)

        //add log file handling
    }


    log(message,severity = this.defaultLevel) {
        const l = this.seperator
        const timestamp = this._getTimestamp()
        const logMsg = this._severityTags(severity).concat(l, timestamp, l, message)
        this._logRouter(severity, logMsg)
    }
    
    //allow logging directly to severity levels
    info(msg){
        this.log(msg,0);
    }
    warn(msg){
        this.log(msg,1);
    }
    error(msg){
        this.log(msg,2);
    }
    fatal(msg){
        this.log(msg,3);
    }
}
