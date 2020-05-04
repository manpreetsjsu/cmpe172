/** Code Reference 
 * This code  has been taken from Material UI
 * https://material-ui.com/components/grid/
 */


import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

// display course info for particular section
export default function SimpleCard(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const courseData = props.courseData
  const section = props.section;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {section.classDay}
        </Typography>
        <Typography variant="h5" component="h2">
          {section.professorName}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {section.classTime}
        </Typography>
        <Typography variant="body2" component="p">
         {courseData.className}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={()=>props.addToCart(section,courseData)} size="small">Add to Cart</Button>
      </CardActions>
    </Card>
  );
}
