const SWWorkerScript = () => {
	let parsed; 
	let interval = null;
	let allow = false;
	
	const runSWValues = (parse) => {
		parsed = parse;
		allow = parsed.allow;

		interval = self.setInterval(
			function(){
				if(allow === true){
					parsed.coord += 0.0625; 
				}
				
				updateTime();
		}, 10);
	};
	
	const updateTime = () => {
		parsed.time[2]++;
		
		if(parsed.time[2] === 100){
			parsed.time[2] = 0;
			parsed.time[1]++;
			
			if(parsed.time[1] === 60){
				parsed.time[1] = 0;
				parsed.time[0]++;
			}
		}
		
		self.postMessage(JSON.stringify(parsed));
	};
	
	const end = () => {
		self.clearInterval(interval);
		interval = null;
		parsed = null;
		allow = false;
	};
	
	self.addEventListener("message", (e) => {
		if(e.data === "stop"){
			return end();
		}
		
		runSWValues(JSON.parse(e.data));
	});
};

export default SWWorkerScript;