exports.numToSxg = (number) ->
	s = ""
	m = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz"
	if number == undefined || number == 0
		return 0
	
	while number > 0
		d = number % 60
		s = m[d] + s
		number = (number - d)/60;
		
	return s