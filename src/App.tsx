import { FormControl, List, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import {db} from './firebase';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import TaskItem from './TaskItem';
import { styled } from '@mui/material/styles';
import { auth } from './firebase';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from "react-router-dom";

const MyTextField = styled(TextField)({
  marginTop: 30,
  marginBottom: 20,
});
const MyList = styled(List)({
  margin: "auto",
  width: "40%",
});

const App: React.FC = (props: any) => {
  let navigate = useNavigate();
  const [tasks, setTasks] = useState([{id: "", title: ""}]);
  const [input, setInput] = useState("");
  useEffect(()=>{
    const unSub =auth.onAuthStateChanged((user)=>{
      !user && navigate("login")
    });
    return () => unSub();
  });
  useEffect(() => {
    const unSub = db.collection("tasks").onSnapshot((snapshot)=>{
      setTasks(
        snapshot.docs.map((doc)=>({id: doc.id, title: doc.data().title}))
      );
    });
    return () => unSub();
  },[]);

  const newTask = (e :React.MouseEvent<HTMLButtonElement>) => {
    db.collection("tasks").add({ title: input });
    setInput("");
  }
  return (
    <div className={styles.app__root}>
      <h1>ToDo App</h1>
      <button 
        className={styles.app__logout}
        onClick={
          async() => {
            try {
              await auth.signOut();
              navigate("login")
            } catch(error: any) {
              alert(error.message);
            }
          }
        }
      >
        <ExitToAppIcon/>
      </button>
      <br/>
      <FormControl>
        <MyTextField
          InputLabelProps={{
            shrink: true,
          }}
          label="New task"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>)=>
            setInput(e.target.value)
          }
        />
      </FormControl>
      <button className={styles.app__icon} disabled={!input} onClick={newTask}>
        <AddToPhotosIcon />
      </button>

      <MyList>
        {tasks.map((task)=>(
          <TaskItem key={task.id} id={task.id} title={task.title} />
        ))}
      </MyList>
    </div>
  );
}

export default App;
