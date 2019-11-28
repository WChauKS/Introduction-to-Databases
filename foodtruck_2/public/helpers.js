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