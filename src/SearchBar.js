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
      options={props.availableClasses}
      getOptionLabel={(row) => row.className}
      style={{ width: 300 }}
      onChange={(event,value)=>handleValueSelection(value)}
      renderInput={(params) => <TextField {...params} label="Search Classes" variant="outlined" />}
    />
  );
}



