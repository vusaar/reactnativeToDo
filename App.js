import { SearchBar ,Icon,Input, Button }from 'react-native-elements';

import React, { Component} from "react";
import { StyleSheet,Text,TextInput, View,SectionList,ScrollView,Modal,Alert} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


const Item = ({ title ,onTaskEdit ,onTaskDelete}) => (
  <View style={styles.itemView}>
    <View style={styles.taskTitleView}>
      <View style={styles.taskTitleTextView}>
       <Text style={styles.taskTitle}>{title.title}</Text>
      </View>              
    </View>
    <View>
      <Text style={styles.subHeading}>Start</Text>
      </View>
    <View style={styles.taskDateTimeView}>
    <Text style={styles.taskDate}>
          <Icon          
           name='calendar-outline'
           type='ionicon'
           color='gray'
           size={15.00}          
         /> {title.start_date.day}/{title.start_date.month}/{title.start_date.year}</Text>
        <Text style={styles.taskTime}>
        <Icon           
           name='time-outline'
           type='ionicon'
           color='gray'
           size={15.00}          
         />
          {title.start_time.hours}:{title.start_time.minutes}</Text>
      </View>
      <View>
      <Text style={styles.subHeading}>End</Text>
      </View>
      <View style={styles.taskDateTimeView}>
        <Text style={styles.taskDate}>
        <Icon           
           name='calendar-outline'
           type='ionicon'
           color='gray'
           size={15.00}          
         /> 
          {title.end_date.day}/{title.end_date.month}/{title.end_date.year}</Text>
        <Text style={styles.taskTime}>
        <Icon           
           name='time-outline'
           type='ionicon'
           color='gray'
           size={15.00}          
         />
          {title.end_time.hours}:{title.end_time.minutes}</Text>
      </View>
      <View style={styles.taskMenuView}>
      <Icon   
           raised  
           onPress={onTaskEdit}     
           name='create'
           type='ionicon'
           color='orangered'
           size={16.00}          
         />
         <Icon   
           raised       
           onPress={onTaskDelete}
           name='trash'
           type='ionicon'
           color='orangered'
           size={16.00}          
         />
        </View>
  </View>
);

class App extends Component {
  
  constructor(props){

     super(props);

     this.taskSectionListRef = React.createRef();

     this.state = {    
     modalVisible: false,

      search:{
          visible:false,
          query:''
      },

     dateState:{
         pickerVisible:false,       
        startEnd:'start'
     },

     timeState:{
         pickerVisible:false,    
         startEnd:'start'
     },
     
     currentTask:{
      id : -1,
      title:'',
      start_date: {
        day: this.addZero(new Date().getDate()).toString(),
        month:this.addZero((new Date().getMonth()+1)).toString(),
        year:new Date().getFullYear().toString(),
      },
      start_time: {
        hours:this.addZero((new Date()).getHours()).toString(),
        minutes:this.addZero((new Date()).getMinutes()).toString()       
      },
      end_date:{
       day: '--',
       month:'--',
       year:'--',
     },
      end_time:{
       hours:'--',
       minutes:'--'       
     }
    } , 
     
    taskPopUp:{
       saveDisabled:false,
    },

     db_data : [
      {
        title: "My Todos",
        data: [
          {
            id : 1,
            title:'sample title',
            start_date: {
              day: this.addZero(new Date().getDate()).toString(),
             month:this.addZero((new Date().getMonth()+1)).toString(),
              year:new Date().getFullYear().toString(),
            },
            start_time: {
              hours:this.addZero((new Date()).getHours()).toString(),
              minutes:this.addZero((new Date()).getMinutes()).toString() 
            },
            end_date:{
             day: '--',
             month:'--',
             year:'--',
           },
            end_time:{
             hours:'--',
             minutes:'--'       
           }
            },


            {
              id : 2,
              title:'sample title 2',
              start_date: {
                day: this.addZero(new Date().getDate()).toString(),
                month:this.addZero((new Date().getMonth()+1)).toString(),
                year:new Date().getFullYear().toString(),
              },
              start_time: {
                hours:this.addZero((new Date()).getHours()).toString(),
                minutes:this.addZero((new Date()).getMinutes()).toString() 
              },
              end_date:{
               day: '--',
               month:'--',
               year:'--',
             },
              end_time:{
               hours:'--',
               minutes:'--'       
             }
              }          
        ]
      }
    ],
    
    search_data  : [
          {
            title: "Search results...",
            data: []
          }
        ],

    };

 
    this.display_data  = this.state.db_data;

 }

 
 sortTasksAscending=()=>{

     console.log("sorting");

      this.state.db_data[0].data.sort((taskA,taskB)=>{
          
          return (this.getTaskDateValue(taskA.start_date,taskA.start_time) - this.getTaskDateValue(taskB.start_date,taskB.start_time));
           
      });
 };


  getTaskDateValue=(taskDate,taskTime)=>{
       
       let dateValue = new Date(Number(taskDate.year), Number(taskDate.month), Number(taskDate.day), Number(taskTime.hours),Number(taskTime.minutes)).valueOf();

       //console.log('date value ' + dateValue);

       return dateValue;
  };


  scrollToTaskIndex=(taskId)=>{

       let taskIndex = this.getTaskIndexInArray(taskId);

      this.taskSectionListRef.current.scrollToLocation({
        sectionIndex: 0,
        itemIndex: taskIndex,
        viewPosition:0,       
      });
  };

 resetCurrentTask=(callBack)=>{
        
  this.setState({currentTask : {
    id : -1,
    title:'',
    start_date: {
      day: this.addZero(new Date().getDate()).toString(),
      month:this.addZero((new Date().getMonth()+1)).toString(),
      year:new Date().getFullYear().toString(),
    },
    start_time: {
      hours:this.addZero((new Date()).getHours()).toString(),
      minutes:this.addZero((new Date()).getMinutes()).toString()       
    },
    end_date:{
     day: '--',
     month:'--',
     year:'--',
   },
    end_time:{
     hours:'--',
     minutes:'--'       
   }
  } },callBack);
  
 };
 
 toggleSearchView=()=>{
           
       this.setState(prevState=>({search:{
        ...prevState.search,
        query:'',
        visible:!this.state.search.visible,            
       }})); 

      this.toggleDiplayResults(); 
 };


toggleDiplayResults=()=>{
    
  if(this.state.search.visible===false){
     this.display_data = this.state.search_data;
  }else{
   
      this.hideSearchResults();
  }
};


hideSearchResults=()=>{

  this.setState(prevState=>({search:{
    ...prevState.search,
    query:'',
    visible:false,            
   }})); 

  this.display_data = this.state.db_data;

  this.state.search_data[0].data =[];

  this.setState({search_data:this.state.search_data});
};


searchTask=(search_text)=>{

   
      let search_results = this.state.db_data[0].data.filter((task)=>{
          return task.title.toLowerCase().includes(search_text.toLowerCase())
       });
    

       this.setState(prevState=>({search:{
         ...prevState.search,
         query:search_text,
       }}));

       if(search_text.trim()!==''){
       this.state.search_data[0].data = search_results;

      this.setState({search_data:this.state.search_data});
    } 
};

 saveTask=()=>{

  //this.state.taskPopUp.saveDisabled = true;

  this.setState(prevState=>({taskPopUp:{
    ...prevState.taskPopUp,
    saveDisabled:true
  }
  }));

   if(this.state.currentTask.id== -1){
      this.saveNewTask();
   }else{
     this.saveEditedTask();
   }
  
   this.display_data = this.state.db_data;

   this.sortTasksAscending();
   this.scrollToTaskIndex(this.state.currentTask.id);
   this.forceUpdate();
   this.scrollToTaskIndex(this.state.currentTask.id);
   
   this.setState(prevState=>({taskPopUp:{
    ...prevState.taskPopUp,
    saveDisabled:false
  }
  }));

    this.hideTaskPopUp();

 };

 saveNewTask=()=>{

   this.state.currentTask.id = new Date().valueOf();

  this.state.db_data[0].data.push(this.state.currentTask);
  console.log(this.state.db_data);

  this.setState({db_data:this.state.db_data});
 };

 saveEditedTask=()=>{
    console.log('saving editted task');

    let arrayIndex = this.getTaskIndexInArray(this.state.currentTask.id);

    this.state.db_data[0].data.splice(arrayIndex,1,this.state.currentTask);

  console.log(this.state.db_data);

  this.setState({db_data:this.state.db_data});
 };

 editTask=(taskId)=>{
  console.log('editting '+taskId);
    let arrayIndex = this.getTaskIndexInArray(taskId);
    
   // console.log(this.state.db_data[0].data[arrayIndex]);
    //return;

    this.setState({currentTask:this.state.db_data[0].data[arrayIndex]},()=>{this.showTaskPopUp();});
 };

 deleteTask=(taskId)=>{
  
  let arrayIndex = this.getTaskIndexInArray(taskId);
  let taskTitle = this.state.db_data[0].data[arrayIndex].title;

  Alert.alert(
    "Delete ?",
    "Delete "+taskTitle,
    [
      { text: "Yes", onPress: ()=>{this.state.db_data[0].data.splice(arrayIndex,1);this.setState({db_data:this.state.db_data});this.hideSearchResults();}, style:'default' },

      {text: "Cancel",onPress: () => console.log("Cancel Pressed"),
        style: "default"
      },
      
    ],
    { cancelable: false }
  );

};


getTaskIndexInArray=(taskId)=>{

    return this.state.db_data[0].data.findIndex((value, index, array)=>{
          
           return value.id==taskId;
         
     });
};

showNewTaskPopUp= ()=>{

    this.resetCurrentTask(this.showTaskPopUp);

};

  showTaskPopUp=()=>{

    this.setState(prevState=>({taskPopUp:{
      ...prevState.taskPopUp,
      saveDisabled:false
    }
    }));

      this.hideSearchResults();

      this.setState({ modalVisible: true });
       
  };


  hideTaskPopUp=()=>{
   
    this.hideDatePicker();
    this.setState({ modalVisible: false });
      
};

  showDatePicker=()=>{ 

     this.setState(prevState=>({dateState:{
       ...prevState.dateState,
      pickerVisible:true,            
      }}),()=>{console.log("show calender complted");}); 
     
  };


  showTimePicker=()=>{
    this.setState(prevState=>({timeState:{
      ...prevState.timeState,
      pickerVisible:true           
      }})); 
  };


  showStartTimePicker=()=>{
    this.setState(prevState=>({timeState:{
      ...prevState.timeState,
       startEnd:'start'           
      }}), this.showTimePicker()); 
  };

  showEndTimePicker=()=>{
    this.setState(prevState=>({timeState:{
      ...prevState.timeState,
       startEnd:'end'           
      }}), this.showTimePicker()); 
  };

  showEndDatePicker=()=>{
      this.setState(prevState=>({dateState:{
        ...prevState.dateState,
           startEnd:'end'
      }}),this.showDatePicker());
  };

  showStartDatePicker=()=>{
    this.setState(prevState=>({dateState:{
      ...prevState.dateState,
         startEnd:'start'
    }}), this.showDatePicker());

    console.log("inside show start date picker");
 };

  hideDatePicker=()=>{
    this.setState(prevState => ({dateState:{
      ...prevState.dateState,
      pickerVisible:false,
      
      }})); 
      
      console.log("inside hide");
  };


  hideTimePicker=()=>{
    this.setState(prevState => ({timeState:{
      ...prevState.timeState,
      pickerVisible:false,
      
      }}), ()=>{console.log("hide time completed");}); 
  }

  changeStartDate=(newDate)=>{
      
    this.setState(prevState=>({currentTask:{     
      ...prevState.currentTask,
      start_date:{
        day: this.addZero(newDate.getDate()).toString(),
        month:this.addZero((newDate.getMonth()+1)).toString(),
        year:newDate.getFullYear().toString(),
      },
      start_time:{
       ...prevState.currentTask.start_time,
      },
      end_date:{
          ...prevState.currentTask.end_date,
      },
      end_time:{
        ...prevState.currentTask.end_time,
      }
     
    }}))
    
    this.forceUpdate();
    console.log(newDate);
  };

  changeEndDate=(newDate)=>{
      
    this.setState(prevState=>({currentTask:{     
      ...prevState.currentTask,
      end_date:{
        day: this.addZero(newDate.getDate()).toString(),
        month:this.addZero((newDate.getMonth()+1)).toString(),
        year:newDate.getFullYear().toString(),
      },
      start_date:{
        ...prevState.currentTask.start_date,
      },
      start_time:{
       ...prevState.currentTask.start_time,
      },
      end_time:{
        ...prevState.currentTask.end_time,
      }
     
    }}))
    
    this.forceUpdate();
    console.log(newDate);
  };

  changeDate=(event, selectedDate)=>{

       /*
          call this first otherwise the calender will appear first
      */
    this.hideDatePicker();

    const newDate = selectedDate || new Date();

        if(this.state.dateState.startEnd=="start"){
          
            this.changeStartDate(newDate);
        }else{
            this.changeEndDate(newDate);
        }
  };

  changeStartTime=(newDate)=>{

     console.log(newDate);
         
    this.setState(prevState=>({currentTask:{
     
      ...prevState.currentTask, 
      end_time:{
        ...prevState.currentTask.end_time,
      } ,   
      start_time:{
        hours:this.addZero((newDate).getHours()).toString(),
        minutes:this.addZero((newDate).getMinutes()).toString()  
      }
     
    }}))
     
                     
  };

  changeEndTime=(newDate)=>{

    console.log(newDate);
        
   this.setState(prevState=>({currentTask:{
    
     ...prevState.currentTask, 
     start_time:{
       ...prevState.currentTask.start_time,
     } ,   
     end_time:{
       hours:this.addZero((newDate).getHours()).toString(),
       minutes:this.addZero((newDate).getMinutes()).toString()  
     }
    
   }}))
                          
 };


  changeTime=(event,selectedDate)=>{
       /*
      call this first otherwise the calender will appear first
    */
    this.hideTimePicker();
    const newDate = selectedDate || new Date(); 
    
     if(this.state.timeState.startEnd=='start'){

          this.changeStartTime(newDate);
     }else{
          this.changeEndTime(newDate);
     }

     this.forceUpdate();
  };


  changeTaskTitle=(value)=>{

        this.setState(prevState=>({currentTask:{
          ...prevState.currentTask,
           title : value,
          start_time:{
            ...prevState.currentTask.start_time,
          } ,   
          end_time:{
            ...prevState.currentTask.end_time,
          }

        }}));
  };

  addZero=(i)=>{
      if(i<10){
        i = "0" + i;
      }
      return i;
  };

 renderItem = ({ item }) => {(
  <Item title={item.title} />
);
 };

  render() {
         
    let searchView;
     if(this.state.search.visible){
             
      searchView  = <View style={{position:'absolute',zIndex:5,width:'99%',height:'70%',left:0,top:0}}>
      <SearchBar
         placeholder="Type Here..."
        onChangeText={this.searchTask}
        value={this.state.search.query}
        lightTheme ={true}
        showCancel={true}
        platform='default'
        searchIcon={<Icon
          name='arrow-back-sharp'
          type='ionicon'
          color='orangered'
          size={22.00}
          onPress= {this.toggleSearchView}
        />}
        containerStyle={{height:'100%',padding:3}}
       
         />
     </View>
           
     }else{

     }

    return (
      <View
        style={styles.container}
      >

       <View style={styles.headingView}>    
       
        <View style={{position:'relative',zIndex:0}}>
           <Text style={styles.headingText}>
             <Text style={{color:'dimgray'}}>To</Text> 
             <Text style={{color:'orangered'}}>Do</Text>             
             </Text>
         </View>
         
         {searchView}

       </View>

      

     <View style={styles.content}>  
     <SectionList
          ref={this.taskSectionListRef}
         
          sections={this.display_data}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => <Item title={item} onTaskEdit={this.editTask.bind(this,item.id)} onTaskDelete={this.deleteTask.bind(this,item.id)} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
        />

          <View style={styles.outerModalView}>
          <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}         
        >

        <ScrollView>
           <View style={styles.innerModalView}>

           <View style={styles.modalMenuView}>
          <Icon
            raised
            name='close-circle-sharp'
            type='ionicon'
            color='orangered'
            size={18.00}
            onPress= {this.hideTaskPopUp}
          />
        </View>
          <View style={styles.modalContentView}>
          <Input
             placeholder='Task...'
             inputStyle ={{alignSelf:'stretch',}}
             value={this.state.currentTask.title}
             onChangeText={this.changeTaskTitle}
           />


           <Text style = {styles.modalInputLabel}>START DATE</Text>
           <Text                        
             onPress = {this.showStartDatePicker}                                      
             style = {styles.modalInputField}
           >
              {this.state.currentTask.start_date.day}/{this.state.currentTask.start_date.month}/{this.state.currentTask.start_date.year}
            </Text>

             { this.state.dateState.pickerVisible===true &&
             (<DateTimePicker
               testID="dateTimePicker"          
               mode="date"
               value={new Date()}
               is24Hour={true}
               display="default"
               onChange={this.changeDate}          
             />)
              }


            <Text style = {styles.modalInputLabel}>START TIME</Text>
            <Text  
            onPress = {this.showStartTimePicker}                       
              style = {styles.modalInputField}                                   
            
           >
              {this.state.currentTask.start_time.hours}:{this.state.currentTask.start_time.minutes}
             </Text>
             { this.state.timeState.pickerVisible===true &&
             (<DateTimePicker
               testID="timePicker"          
               mode="time"
               value={new Date()}
              is24Hour={false}
               display="default"
               onChange={this.changeTime}          
             />)
              }
           

           <Text style = {styles.modalInputLabel}>END DATE</Text>
           <Text                        
             onPress = {this.showEndDatePicker}                                      
             style = {styles.modalInputField}
           >
              {this.state.currentTask.end_date.day}/{this.state.currentTask.end_date.month}/{this.state.currentTask.end_date.year}
            </Text>

            <Text style = {styles.modalInputLabel}>END TIME</Text> 

            <Text  
            onPress = {this.showEndTimePicker}                       
              style = {styles.modalInputField}                                   
            
           >
              {this.state.currentTask.end_time.hours}:{this.state.currentTask.end_time.minutes}
             </Text>

          </View>
 
           <View style={styles.modalFooterView}>
            <Button
            icon={
              <Icon
                 raised
                 type='ionicon'
                name="save-outline"
                size={15}
                color="orangered"
              />
            } 
            title="Save"
             type="clear"
             disabled={this.state.taskPopUp.saveDisabled}
             buttonStyle={styles.button}
             onPress = {this.saveTask}
             titleStyle={styles.bottonTitle}/>  

            <Button 
             icon={
              <Icon
                 raised
                 type='ionicon'
                name="close-circle"
                size={15}
                color="orangered"
              />
            } 
            title="Close"
             type="clear"             
             onPress={this.hideTaskPopUp} 
             buttonStyle={styles.button}
             titleStyle={styles.bottonTitle}
             />
             </View>
           </View>
           </ScrollView>
          </Modal>
          </View>

      </View>

      <View style={styles.menuContent}>
        <Icon
           raised
           name='search'
           type='ionicon'
           color='orangered'
           size={18.00} 
           onPress= {this.toggleSearchView}          
         />

        <Icon
           raised
           name='add'
           type='ionicon'
           color='orangered'
           size={18.00}
           onPress= {this.showNewTaskPopUp}
         />
      </View>
            
      </View>

    );
  }
};

const styles = StyleSheet.create(
  {
     menuContent:{
       flex:1,
       flexDirection:'row',
        justifyContent:'flex-end',        
        paddingRight:30,       
        borderTopWidth:0,
        paddingTop:0,
        marginTop:0,
        backgroundColor:'#e4e6e8',
        elevation:5,
       
     },

    content:{
      flex:9,
      margin:0,
      marginHorizontal:10,
      padding:2 
    },

    container:{
      flex: 1,
      flexDirection:'column',
      paddingTop:25,      
      backgroundColor:'#ffffff',    
    },

    headingView:{
        flex:1,
        flexDirection:'column',         
        elevation:5,
        backgroundColor:'#e4e6e8',
        width:'100%'
    },

    headingText:{
        fontSize:25,
        fontWeight:'bold',
        paddingTop:10,          
        alignSelf:'center',
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: {width: 1, height: 2},
        textShadowRadius: 5
    },

    itemView: {
      backgroundColor: '#ffffff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 10
    },

    taskTitleView:{
         borderBottomWidth:1,
         borderBottomColor:"#D3D3D3",
         flexDirection:'row',         
         flex:1
    },

   
    
    taskTitleTextView:{
      flex:1
    },

    taskMenuView:{
      flexDirection:'row',
       justifyContent:'flex-end',      
      borderTopWidth:1,
      borderTopColor:"#D3D3D3",           
    },

   
    taskTitle: {
      fontSize: 16,
      paddingVertical:5,
      color:'#393d3f',
      fontWeight:'bold'
    },


    taskDateTimeView :{
      flexDirection:"row",     
      flex:1
    },

    taskDate:{     
      flex:0.5,
      padding:5,
      paddingVertical:10,
    },

    taskTime:{     
      flex:0.5,
      padding:5,
      paddingVertical:10
    },

    subHeading:{
       paddingTop:5,
       fontWeight:"600"
    },

    outerModalView: {
     
     
    },

    innerModalView: {
      margin :40,     
      backgroundColor: "white",
      borderRadius: 10,      
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 10,
      flex:1,
      flexDirection:"column",
      alignItems:'stretch'
    },

    modalMenuView:{
      flexDirection:'row',
      justifyContent:'flex-end',
      flex:1     
    },
 
    modalContentView:{
      flexDirection:'column',
      flex:5      
    },


    modalInputLabel:{
      paddingLeft:15,
      alignSelf:"stretch",
      fontSize:12
    },

    modalInputField:{
        paddingLeft:20,
        paddingTop:10,
        paddingBottom:30,
        marginTop:0,
        alignSelf:'stretch' ,
        fontSize:18
    },

    modalFooterView:{
      justifyContent:'flex-end',      
      borderTopWidth:1,
      borderTopColor:"#D3D3D3", 
      flexDirection:'row',   
      flex:1, 
      padding:0,    
      paddingRight:10
    },

    button: {    
       padding:5,
       margin:0
    },

    bottonTitle :{
      color :'orangered',
      padding:0,
      margin:0
    }

  }
);

export default App;
