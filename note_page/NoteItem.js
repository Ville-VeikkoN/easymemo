class NoteItem {
  constructor(title, content, color) {
    this.title = title;
    this.content = content;
    this.date = new Date();
    this.checked = false;
    this.style = {
      backgroundColor: color,
      underLine: false,
      overLine: false,
    }
  }
}

export default NoteItem;