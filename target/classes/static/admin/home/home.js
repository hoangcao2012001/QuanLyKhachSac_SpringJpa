app.controller("home-ctrl", function($scope,$http){
	$scope.getAllKH = [];
	$scope.totalKH = 0;
	$scope.getHD = [];
	$scope.totalHD = 0;
	$scope.initialize = function() {
		$scope.getKh();
		$scope.getHD();
	}
	$scope.getKh = function() {
		$http.get("/HD/rest/customers").then(resp => {
			$scope.getAllKH = resp.data;
			$scope.getAllKH.forEach(item => {
				$scope.totalKH = 1 + $scope.totalKH
			})
			console.log($scope.totalKH)
		})	

	}
	$scope.getHD = function() {
		$http.get("/HD/rest/hoadon").then(resp => {
			$scope.getHD = resp.data;
			$scope.getHD.forEach(item => {
				console.log(item.tongTien)
				$scope.totalHD = item.tongTien + $scope.totalHD
			})
			console.log($scope.totalHD)
		})	

	}
	$scope.initialize();
})