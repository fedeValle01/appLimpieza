
export const formatTime = (timestamp) => {

    let dateTime = timestamp.toDate();

    dateTime.setUTCHours(dateTime.getUTCHours() - 3);
    
    let limitDate = new Date(
      dateTime.getFullYear(),
      dateTime.getMonth()+1,
      dateTime.getDate(),
      dateTime.getHours()+3,
      dateTime.getMinutes(),
      );

    let msjDate = `${limitDate.getDate().toString()}/${limitDate.getMonth().toString()} hasta ${limitDate.getHours().toString()}:${limitDate.getMinutes().toString()}`
    return msjDate
}