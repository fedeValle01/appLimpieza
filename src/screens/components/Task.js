import { TextInput, TouchableOpacity, Text, SafeAreaView, Image, StyleSheet, Alert, View, Pressable } from "react-native";
import { Tooltip } from '@rneui/themed';
import { Checkbox } from "react-native-paper";
import React, {memo, useEffect, useState} from 'react';
import { initializeApp } from "firebase/app";
import { doc, getFirestore, serverTimestamp, updateDoc } from "firebase/firestore";
import styles from "../stylesScreens";
import firebaseConfig from "../../firebase-config";




    
const Task = ( {props} ) => {

    const uidTask = props.uidTask
    const item = props.item
    const i = props.i
    let controlCheckList = props.controlCheckList
    let checkList = props.checkList
    const canControl = props.canControl
    const canCheckTask = props.canCheckTask
    const allDescTasks = props.allDescTasks
    const activeTasks = props.activeTasks
    const groupCode = props.groupCode
    
    const [taskCheck, setTaskCheck] = useState(checkList[i])
    const [taskControlCheck, setTaskControlCheck] = useState(controlCheckList[i])
    const [showTask, setShowTask] = useState(true)


    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);


    const IconInfo = memo(() => (
        <Image
          style={{ width: 17, height: 17 }}
          source={require("../../assets/info-circle.png")}
        />
      )
    );

    const AreYouSureDeleteTask = () => {
        return Alert.alert("Vas a eliminar la tarea: "+item+" De las tareas asignadas", "Estas seguro?", [
          {
            text: "Cancelar",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },    
          { text: "OK", onPress: deleteTask },
        ]);
      }
    

    const handleControlCheck = async () => {

        if(taskControlCheck=='checked'){
            setTaskControlCheck('unchecked')
            controlCheckList[i] = 'unchecked'

        }else{
            setTaskControlCheck('checked')
            controlCheckList[i] = 'checked'
        }

        await updateDoc(doc(db, "groups", groupCode, "assigned_tasks", uidTask), {
            control_marked_tasks: controlCheckList,
            timestamp_control_marked_tasks: serverTimestamp(),
        });

    }


    const handleCheck = async () => {

        if(taskCheck=='checked'){
            setTaskCheck('unchecked')
            checkList[i] = 'unchecked'

        }else{
            setTaskCheck('checked')
            checkList[i] = 'checked'
        }

        await updateDoc(doc(db, "groups", groupCode, "assigned_tasks", uidTask), {
            marked_tasks: checkList,
            timestamp_marked_tasks: serverTimestamp(),
        });

    }


    const deleteTask = async () => {

        let updateActiveTasks = activeTasks
        let findTask = false
        let i = 0
        let indexToDelete = 0
        while (!findTask) {
        let activeTask = updateActiveTasks[i]
        let sector = activeTask.data
        for (let j = 0; j < sector.length; j++) {
            let task = sector[j];
            if (task == item){
            console.log('lo encontro');
            findTask = true
            sector.splice(j, 1)
            break
            }
            indexToDelete++
        }
        i++
        if (i > sector.length){
            findTask = true
        }
        }

        let ref = doc(db, "assigned_tasks", uidTask);

        let updateCheckList = checkList
        let updateControlCheckList = controlCheckList
        updateCheckList.splice(indexToDelete, 1)
        updateControlCheckList.splice(indexToDelete, 1)
        
        await updateDoc(ref, {
            active_tasks: updateActiveTasks,
            marked_tasks: updateCheckList,
            control_marked_tasks: updateControlCheckList,
        }).then(()=> {
          setShowTask(false)
        })
        
    }

    const calculeHeight = (desc) => {
        let h = 100;
        let haveDesc = false;
        if(desc!=null){
          haveDesc = true;
          let descLength = desc.length;
          if(descLength<=28){ // one line
            h = 40
          }else if(descLength>28 &&descLength<45){// two lines
            h = 60
          }else if(descLength>=45 && descLength<65){// three lines
            h = 80
          }else if(descLength>=65 && descLength<100){ //four lines
            h = 100
          }else if(descLength>=100 && descLength<120){ //five lines
            h = 130;
          }else{
            h = 180;
          }
        }
        return(h)
      }

      const ControlledTooltip = (props) => {
        const [open, setOpen] = React.useState(false);
        return (
              <Tooltip
                visible={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                {...props}
              />
        );
      }



    const Item = ({ title, i }) => { // RENDER ITEM TASK
        let haveDesc = false;
        let h = 0
        let desc = allDescTasks[i]
        if(desc!=null){
            haveDesc = true;
            h = calculeHeight(desc)
        }
    
        title = title.trim()
        
            return(
            <View style={[styles.itemSectionlist, {maxWidth: '60%'}] }>
                {haveDesc &&
    
                <ControlledTooltip
                        popover={<Text>{desc}</Text>}
                        containerStyle={{ width: 200, height: h }}
                        backgroundColor={"#f6cb8e"}
                    >
    
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: 'space-between'}}>
                        <View>
                            <Text numberOfLines={2} style={[styles.titleSectionlist ]}>{title}</Text>
                        </View>
                        <View style={{marginLeft: 10}}>
                            <IconInfo/>
                        </View>
                        </View>
                        
                </ControlledTooltip>
    
                }
                {!haveDesc &&
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: 'space-between'}}>
                        <Text numberOfLines={2} style={[styles.titleSectionlist]}>{title}</Text>
                        </View>
                }
            </View>
            );
        }


    if (showTask) return (
        <TouchableOpacity style={styles.viewSeccion} disabled={!canControl} onLongPress={AreYouSureDeleteTask}>
            <Item title={item} i={i}/>

            <View style={{ flexDirection: "row", alignItems: "center", position: "absolute", right: 0 }}>
                <View>
                    <Checkbox
                    disabled={!canCheckTask}
                    status={taskCheck}
                    onPress={handleCheck}
                    
                    />
                </View>
                <View>
                    <Checkbox
                    color="#39ff14"
                    status={taskControlCheck}
                    disabled={!canControl}
                    onPress={handleControlCheck}
                    />
                </View>
            </View>
        </TouchableOpacity>
    )
  };export default Task;