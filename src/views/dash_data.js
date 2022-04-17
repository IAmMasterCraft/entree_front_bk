const axios = require("axios");

const getDashboardData = async () => {
	const result = {};
	try {
		const config = {
			method: "get",
			url: `${/*window.location.origin*/'https://entreelab.org'}/src/api/dashboard`,
			headers: {
				"Authorization": localStorage.getItem("token"),
			},
		};
		const response = await axios(config);
		result.main = response.data;
	} catch(error) {
		result.error = error;
	}
	return result;
}


export default getDashboardData;
