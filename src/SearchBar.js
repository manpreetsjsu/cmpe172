/** COde Reference
 * This code  has been taken from Material UI
 * https://material-ui.com/components/autocomplete/
 */

/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function SearchBar(props) {

    const handleValueSelection = (valueSelected)=>{
        console.log(valueSelected);
        props.handleUserSearchSelection(valueSelected);
    }
  return (
    <Autocomplete
      id="combo-box-demo"
      options={rows}
      getOptionLabel={(row) => row.className}
      style={{ width: 300 }}
      onChange={(event,value)=>handleValueSelection(value)}
      renderInput={(params) => <TextField {...params} label="Search Classes" variant="outlined" />}
    />
  );
}

const rows= 
    [
        {   
            className: "CMPE 172", 
            sections: [
            {sectionNumber: "1",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed", professorName: "Jake Taylor"},
            {sectionNumber: "2",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed", professorName: "Kane Lyke"},
            {sectionNumber: "3",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed",professorName: "Kite Phan"} 
            ]
        },
        {   
            className: "CMPE 188", 
            sections: [
            {sectionNumber: "1",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed", professorName: "Goal Bair"},
            {sectionNumber: "2",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed", professorName: "Colman Lie"},
            {sectionNumber: "3",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed",professorName: "Snow Lane"} 
            ]
        },
        {   
            className: "CMPE 102", 
            sections: [
                {sectionNumber: "1",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed",professorName: "Kayle Bair" },
                {sectionNumber: "2",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed", professorName: "Kyla Nay"},
                {sectionNumber: "3",classTime: "6:00PM-8:45PM", classDay: "Mon-Wed",professorName: "Jon Snow"} 
            ]
        },
    ];

