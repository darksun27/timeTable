//Dependencies
const XLSX       = require('xlsx');

//Constants
const inputFile   = process.argv[2];
const outputFile  = process.argv[3];
const classType   = {
    'T' : 'Tutorial',
    'L' : 'Lecture',
    'P' : 'Practical'
}
const days        = {
    'MON' : 'Monday',
    'TUES': 'Tuesday',
    'WED' : 'Wednesday',
    'THUR': 'Thursday',
    'FRI' : 'Friday',
    'SAT' : 'Saturday'
}
const mySubjects  = {
    '20B16CS323'   : 'Problem Solving',
    'CS312' : 'Blockchain technology',
    'CI635'   : 'Data and Web Mining',
    'CI611'   : 'Compiler Design',
    'MA633'   : 'Statistics',
    'HS631'   : 'Project Management',
    'CI671'   : 'Compiler Design Lab',
}
const classes     = {
    'MON' :[],
    'TUES':[],
    'WED' :[],
    'THUR':[],
    'FRI' :[],
    'SAT' :[]
};

//Reading the file
console.log("Reading File: ",inputFile);

var workbook     = XLSX.readFile(inputFile);
var sheetName    = workbook.SheetNames[0];
var sheet        = workbook.Sheets[sheetName];

var keys = Object.keys(sheet).filter(key => key.match(/[A-Z][0-9]+/g));
var temp = {}
keys.forEach(key => {
    var column        = key[0];
    var row     = key.slice(1);
    var value      = sheet[key].v;
    var myClass    = /([LPT])(.*[B][C]*)(.*[1][4].*)*(.[C].*)*([(])/g.exec(value);
    var whichClass = /([(]).*([)])/g.exec(value);
    var whereClass = /([-]).*([/])/g.exec(value);
    var teachers   = /([/]).*/g.exec(value);
    if(myClass){
        var subjectCode = whichClass[0].substring(1,whichClass[0].length-1)
        if(whichClass && mySubjects[subjectCode]){
            console.log(myClass[0])
            var day = getDayValue(row);
            // if (temp[mySubjects[subjectCode]]){
            //     temp[mySubjects[subjectCode]]++
            // }
            // else{
            //     temp[mySubjects[subjectCode]] = 1
            // } 
            console.log(day, myClass[1], mySubjects[subjectCode], whereClass, sheet[column+'2'].v.split(" ")[0].split("-")[0])
            pushDataToArray(day, myClass[1], mySubjects[subjectCode], whereClass, teachers[0].substring(1,teachers[0].length-1), sheet[column+'2'].v.split(" ")[0].split("-")[0]);
        }
    }
})
console.log(temp)
//Sorting According to time
const sortedClass = {
    'MON' :[],
    'TUES':[],
    'WED' :[],
    'THUR':[],
    'FRI' :[],
    'SAT' :[]
};
var timeSlots = [9,10,11,12,1,2,3,4];
Object.keys(classes).forEach((day)=>{
    timeSlots.forEach((timeslot)=>{
        classes[day].forEach((classItem)=>{
            if(timeslot == classItem.start){
                sortedClass[day].push(classItem);
            }
        })
    })
})

//Dumping Results into File
console.log("Writing Time Table to File: ",outputFile);

//Functions
function getDayValue(row){
    try{
        return sheet['A'+row].v;
    } catch{
        return getDayValue(row-1);
    }
}
function pushDataToArray(day, type, subject, venue, teachers, time){
    venue = venue[0].split("-").slice(-1);
    venue = venue[0].substring(0,venue[0].length-1);
    classes[day].push({
        day      :days[day],
        type     :classType[type],
        start    :time,
        time24   :parseInt(time) < 5 ? parseInt(time) + 12 : parseInt(time),
        subject  :subject,
        venue    :venue,
        teachers :teachers.split(",")
    })
}

module.exports = {
    sortedClass,
    classes
}
