function queryAll(filters,start,limit){
	var sql='select o.*,t.typeNum,t.typeName,e.number from locobj as o '+
			'left join loctype as t on o.type_id=t.id '+
			'left join eletag as e on o.eletag_id=e.id';
	if (filters!=null&&filters!='') {
		var filter=JSON.parse(filters);
		var rules=filter.rules;
		if(rules.length>0){
			sql+=' where ';
		}
		for(var i=0;i<rules.length;i++){
			var filter=rules[i];
			// console.log(filter);
			if(filter.field=="alias"){
				sql+='o.'+filter.field;
			}else{
				sql+=filter.field;
			}
			sql+=" like '%"+filter.data+"%'";
			if (i<rules.length-1) {
				sql+=' and ';
			}
		}
	}
	sql+=' limit '+start+','+limit; 
	return sql;

}

module.exports=queryAll;
