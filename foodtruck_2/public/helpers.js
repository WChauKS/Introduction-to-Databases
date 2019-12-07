// helper function for handlebars to process default selection in the Modify Truck Schedule table on truckschedule.handlebars
// checks to see if the value matches, if true then it is the default selection
// Result: page loads with drop downs correctly populated
module.exports = {
    select: function (selected, option) {
    	console.log(selected, option);
        if(selected == option){
        	return 'selected';
        }else{
        	return '';
        }
    }
};