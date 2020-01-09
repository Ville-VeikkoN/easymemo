class MemoItem {
  constructor(title, content, date, alarm, allDay ) {
    this.title = title;
    this.notes = content;
    this.startDate = date;
    this.endDate = date;
    this.alarm = alarm;
    this.allDay = allDay;
    this.date = date;
  }
}

export default MemoItem;