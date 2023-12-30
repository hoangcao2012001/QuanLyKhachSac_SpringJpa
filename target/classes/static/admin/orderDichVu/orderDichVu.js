app.controller("orderDV-ctrl", function($scope, $http) {	
	$scope.items = [];
	$scope.itemsDV = [];
	$scope.form = {};
	$scope.chonDV = {};
	$scope.toDay = new Date();
	$scope.orderByMaDP = [];
	$scope.formAddDV = { ngayOrder : new Date()};
	$scope.initialize = function() {
		$('.modal-backdrop').hide();
		$http.get("/HD/rest/datphong/trangThai").then(respTT => {
			$scope.items = respTT.data;
			$scope.items.forEach(item => {
				item.ngayBD = new Date(item.ngayBD)
					item.ngayBD.setHours(0);
					item.ngayBD.setMinutes(0);
					item.ngayBD.setSeconds(0);
					item.ngayBD.setMilliseconds(0)
				item.ngayKT = new Date(item.ngayKT)
					item.ngayKT.setHours(0);
					item.ngayKT.setMinutes(0);
					item.ngayKT.setSeconds(0);
					item.ngayKT.setMilliseconds(0)
				item.toDay = $scope.toDay;
					item.toDay.setHours(0);
					item.toDay.setMinutes(0);
					item.toDay.setSeconds(0);
					item.toDay.setMilliseconds(0)
				console.log(item)
			})
		})
		$scope.listDV();		
	}
	$scope.listOrderDV = function(item) {	
		console.log(item.maDatPhong)
		$http.get(`/HD/rest/orderDichVu/${item.maDatPhong}`).then(respOrderByMP => {
			$scope.orderByMaDP = respOrderByMP.data;
		})	
	}
	$scope.listDV = function(item) {	
		$http.get("/HD/rest/dichvu").then(respDV => {
			$scope.itemsDV = respDV.data;
		})		
	}
	$scope.initialize();
	$scope.orderDV = function(item) {	
		$scope.formAddDV = {soLuong: 1, ngayOrder : new Date(), ...angular.copy(item)};		
		 console.log( $scope.formAddDV);
		 $scope.listOrderDV(item);
	}
	$scope.createOrderDV = function() {
			var item = angular.copy($scope.formAddDV);
			console.log(item.ngayBD.setHours(0,0,0,0));
			console.log(item.ngayOrder.setHours(0,0,0,0));
			var sendData = {
								soLuong : item.soLuong,
								ngayOrder : item.ngayOrder,
								maDatPhong:{maDatPhong : item.maDatPhong},
								maDichVu: {maDichVu : item.maDichVu}
							};	
			if(	item.ngayBD > item.ngayOrder){
				Swal.fire({
						icon: 'warning',
						title: 'Phòng Chưa Có Khách Bạn Có Nhầm Gì Đó Không!',
						type: 'warning',
						timer:'2000' 
					})
			}else if(item.maDichVu == null){
					Swal.fire({
						icon: 'warning',
						title: 'Vui Lòng Chọn Dịch Vụ Cần Gọi!',
						type: 'warning',
						timer:'2000' 
					})
			}else if(item.soLuong < 0){
					Swal.fire({
						icon: 'warning',
						title: 'Số Lượng Phải > 1!',
						type: 'warning',
						timer:'2000' 
					})
			}else{

				$http.post('/HD/rest/orderDichVu', sendData).then(respOrder => {
					console.log(respOrder.data);
					$scope.listDV();
					$http.get(`/HD/rest/orderDichVu/${sendData.maDatPhong.maDatPhong}`).then(respOrderByMP => {
								$scope.orderByMaDP = respOrderByMP.data;
							})
					Swal.fire({
						icon: 'success',
						title: 'Gọi Dịch Vụ Thành Công!',
						type: 'success',
						timer:'2000' 
					})
				}).catch(error => {
						Swal.fire({
							icon: 'error',
							title: 'Gọi Dịch Vụ Thất Bại!',
							type: 'error',
							timer: '2000'
								})
						console.log("Error", error);
				})
			}
		}
	$scope.reset = function() {
		$scope.items = [];
		$scope.form = {};
		
	};
	$scope.pagerOrder = {
		page: 0,
		size: 5	,
		get items() {
			var start = this.page * this.size;
			return $scope.orderByMaDP.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.orderByMaDP.length / this.size);
		},
		first() {
			this.page = 0;
		},
		prev() {
			this.page--;
			if (this.page < 0) {
				this.last();
			}
		},
		next() {
			this.page++;
			if (this.page >= this.count) {
				this.first();
			}
		},
		last() {
			this.page = this.count - 1;
		}

	}

	$scope.pager = {
		page: 0,
		size: 10,
		get items() {
			var start = this.page * this.size;
			return $scope.items.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.items.length / this.size);
		},
		first() {
			this.page = 0;
		},
		prev() {
			this.page--;
			if (this.page < 0) {
				this.last();
			}
		},
		next() {
			this.page++;
			if (this.page >= this.count) {
				this.first();
			}
		},
		last() {
			this.page = this.count - 1;
		}

	}
})