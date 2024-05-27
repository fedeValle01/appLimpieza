
export const getState = (marked, control, haveTasks) => {
    
    if(!haveTasks) return('none')

    let haveAllControlCheck = true;
    let i = 0
    while (haveAllControlCheck && i < control.length) {
      if (control[i] == 'unchecked'){
        haveAllControlCheck = false
      }
      i++
    }
    if (haveAllControlCheck){
      return('finished')
    }else{
    let haveSomeCheck = false;
    let j = 0
    while (!haveSomeCheck && j < marked.length) {
      if (marked[j] == 'checked'){ // if have one or more tasks mark as completed
        haveSomeCheck = true
      }
      j++
    }
    if (haveSomeCheck){
      return('completed')
    }else{
      return('active')
    }
  }
}
