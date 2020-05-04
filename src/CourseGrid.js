import React,{useEffect,useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import SimpleCard from './Card';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

// displays list of sections for particular Course
export default function CourseGrid(props) {
  const [spacing, setSpacing] = React.useState(2);
  const classes = useStyles();

  const [courseData,setCourseData] = React.useState(props.selectedCourse);
  const handleChange = (event) => {
    setSpacing(Number(event.target.value));
  };

  useEffect(()=>{
    console.log("use effect course",props.selectedCourse);
    setCourseData(props.selectedCourse);
  },[props.selectedCourse])

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={2}>
          {courseData.length && courseData.map((eachClass) => (
                eachClass.sections.map((section)=>(
                  <Grid key={section.sectionNumber+eachClass.className} item>
                      <SimpleCard addToCart={props.addToCart} courseData={eachClass} section={section} ></SimpleCard>
                    </Grid>
                ))
              
          ))}
          {!courseData.length && courseData.sections.map((value) => (
            <Grid key={value.sectionNumber} item>
              <SimpleCard addToCart={props.addToCart} courseData={courseData} section={value} ></SimpleCard>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
