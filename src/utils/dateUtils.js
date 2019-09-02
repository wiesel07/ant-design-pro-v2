import moment from 'moment';
require("moment-precise-range-plugin");
moment.locale('zh-cn');

/**
 * 格式化时间
 * @param date yyyymmddHHMMSS
 * @param format yyyymmddHHMMSS
 * @returns yyyy年mm月dd日 HH:MM:SS
 */
export function formatDate(param) {
    let dateStr = "", formatStr = "";
    if (typeof param === 'string') {
        dateStr = param;
    } else {
        let { date, format } = param;
        dateStr = date;
        formatStr = format;
    }
    if (!dateStr || dateStr === "null") {
        return "";
    }
    
    switch (formatStr) {
        // 年月
        case "yyyymm":
            return dateStr.substring(0, 4) + "-" + dateStr.substring(4, 6) + "-";
            break;
        // 年月日时分
        case "yyyymmddHHMM":
            return dateStr.substring(0, 4) + "-" + dateStr.substring(4, 6) + "-" + dateStr.substring(6, 8) + " " +
                dateStr.substring(8, 10) + ":" + dateStr.substring(10, 12);
            break;
        // 年月日时分秒
        case "yyyymmddHHMMSS":
            return dateStr.substring(0, 4) + "-" + dateStr.substring(4, 6) + "-" + dateStr.substring(6, 8) + " " +
                dateStr.substring(8, 10) + ":" + dateStr.substring(10, 12) + ":" + dateStr.substring(12, 14);
            break;
        // 月日时分秒
        case "mmddHHMMSS":
            return dateStr.substring(4, 6) + "-" + dateStr.substring(6, 8) + " " +
                dateStr.substring(8, 10) + ":" + dateStr.substring(10, 12) + ":" + dateStr.substring(12, 14);
            break;
        // 月日时分
        case "mmddHHMM":
            return dateStr.substring(4, 6) + "-" + dateStr.substring(6, 8) + " " +
                dateStr.substring(8, 10) + ":" + dateStr.substring(10, 12);
            break;
        // 年月日
        default:
            return dateStr.substring(0, 4) + "-" + dateStr.substring(4, 6) + "-" + dateStr.substring(6, 8) + " ";
    }
}

export function dateToString (date,format) {
 return  moment(date).format(format);
}
export function dateToMonthCn(val) {
  return moment(val,'YYYYMM').format('YYYY[年]MM[月]')
}
export function dateFormat(val,oladForamt,newFormat) {
  return moment(val,oladForamt).format(newFormat);
}
/**
 * 格式化时间
 * @param date yyyymmddHHMMSS
 * @returns yyyy-mm-dd HH:MM:SS
 */
export function formatDateTime  (date){
  if(date===null || date===undefined || date=== 'null'){
    return '';
  }
  if (date.length === 14) {
    return date.substring(0,4)+'-'+date.substring(4,6)+'-'+date.substring(6,8)+' '+
      date.substring(8,10)+':'+date.substring(10,12)+':'+date.substring(12,14);
  }if (date.length === 12) {
    return date.substring(0,4)+'-'+date.substring(4,6)+'-'+date.substring(6,8)+' '+
      date.substring(8,10)+':'+date.substring(10,12);
  }
  if(date.length === 8) {
    return date.substring(0,4)+'-'+date.substring(4,6)+'-'+date.substring(6,8);
  }
  if(date.length === 6) {
    return date.substring(0,2)+':'+date.substring(2,4)+':'+date.substring(4,6);
  }
  if(date.length === 4) {
    return date.substring(0,2)+':'+date.substring(2,4);
  }
  return date;
}

/**
 * 格式化时间组件数据
 * @param date yyyymmddHHMMSS
 * @returns yyyy-mm-dd HH:MM:SS
 */
export function formatMomentDate  (param){
    const defaultParam = {
        type: "toMoment",
        date: {},
        fields: [],
        format: "YYYYMMDD"
    };
    let curParams = {};
    Object.assign(curParams, defaultParam, param);
    
    const { type, date, fields, format } = curParams;
    let dates = {};
    fields.map((item, index)=>{
        let data = {};
        if (type === "toMoment" && (typeof date[item]) === "string") {
            dates[item] = moment(date[item]);
        } else {
            dates[item] = dateToString(date[item], format);
        }
    });
    return dates;
}

//将数字转换成n年n月格式
export function dateToMonthYear(val) {
    if(val===null || val===undefined || val=== 'null'||val==""){
        return '';
    }
    let month=val%12
    let year=parseInt(val/12)
    if(month==0){
        return year+"年"
    }else if(year==0){
        return month+"个月"
    }else{
        return year+"年"+month+"个月"
    }
    
}

/**
 * 格式化年月
 * @param date yyyymm
 * @returns yyyy-mm
 */
export function formatMonthTime  (date){
    if(date===null || date===undefined || date=== 'null'){
      return '';
    }
    if(date.length === 6) {
      return date.substring(0,4)+'-'+date.substring(4,6);
    }
    return date;
}

/**
 * 时间间隔计算
 * @param startDate yyyymmddHHMMSS
 * @param endDate yyyymmddHHMMSS
 * @param dateFormatString yyyymmddHHMMSS
 * @returns dd天hh时mm分ss秒
 */

export function calculationTime(startDate, endDate, dateFormatString = 'YYYYMMDDHHmmss') {
    if (!startDate || !endDate) {
        return '';
    }
    const mStartDate = moment(startDate, dateFormatString);
    const mEndDate = moment(endDate, dateFormatString);
    const preciseDiff = moment.preciseDiff(mStartDate, mEndDate, true);
    let years = preciseDiff.years > 0 ? `${preciseDiff.years}年` : "";//年
    let months = preciseDiff.months > 0 ? `${preciseDiff.months}个月` : "";//月
    let days = preciseDiff.days > 0 ? `${preciseDiff.days}天` : "";//日
    let hours = preciseDiff.hours > 0 ? `${preciseDiff.hours}时` : "";//时
    let minutes = preciseDiff.minutes > 0 ? `${preciseDiff.minutes}分` : "";//分
    let seconds = preciseDiff.seconds > 0 ? `${preciseDiff.seconds}秒` : "";//秒
    return `${years}${months}${days}${hours}${minutes}${seconds}`;
}