const app = angular.module("user-app", []);

app.controller("user-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.phongFalse = [];
	$scope.form = {};
	$scope.formDP = {};
	$scope.initialize = function() {
		$scope.loadLP();
	}
	$scope.seachDP = function(){
		console.log("DP")
	}
	$scope.seachByLoaiPhong = function() {
		if ($scope.form.maLoaiPhong == null) {
			Swal.fire({
				icon: 'warning',
				title: 'Vui Lòng Chọn Loại Phòng Cần Đặt !',
				type: 'warning',
				timer: '2000'
			})
		} else {
			var item = angular.copy($scope.form);
			console.log(item);
			$http.get(`/HD/rest/phong/seachLoai/${item.maLoaiPhong.maLoaiPhong}`).then(resp => {
				$scope.phongFalse = resp.data;
			})
		}
	}
	$scope.seachDPByLP = function(item){
		console.log(item)
		$http.get(`/HD/rest/phong/seachLoai/${item.maLoaiPhong}`).then(resp => {
				$scope.phongFalse = resp.data;
			})
		$('#exampleModal1').modal('show');
	}
	$scope.loadLP = function(){
			$http.get("/HD/rest/loaiphong").then(resp => {
			$scope.items = resp.data;
		})
	}
	$scope.initialize();
	$scope.createDP = function(p) {
		var item = angular.copy($scope.formDP);
		var itemDP = {
			maPhong: { maPhong: p.maPhong },
			ngayBD: item.ngayBD,
			ngayKT: item.ngayKT,
		}
		var checkNgayNhan = new Date();
		 if (item.ngayBD == null) {
			Swal.fire({
				icon: 'warning',
				title: 'Vui Lòng Chọn Ngày Nhận Phòng!',
				type: 'warning',
				timer: '2000'
			})
		} else if (item.ngayKT == null) {
			Swal.fire({
				icon: 'warning',
				title: 'Vui Lòng Chọn Ngày Trả Phòng!',
				type: 'warning',
				timer: '2000'
			})
		} else if (itemDP.ngayBD.setHours(0,0,0,0) <   checkNgayNhan.setHours(0,0,0,0)) {
			Swal.fire({
				icon: 'warning',
				title: 'Ngày Nhận Phòng Phải >= Ngày Hôm Nay!',
				type: 'warning',
				timer: '2000'
			})
		} else  if (itemDP.ngayKT < itemDP.ngayBD) {
			Swal.fire({
				icon: 'warning',
				title: 'Ngày Trả Phòng Phải >= Ngày Nhận!',
				type: 'warning',
				timer: '2000'
			})
		} else {
			
			$http.get(`/HD/rest/datphong/${p.maPhong}/${itemDP.ngayBD}/${itemDP.ngayKT}`).then(resp => {
				var dataDP = resp.data;
				console.log($scope.dataDP)

				if (dataDP.length > 0) {
					Swal.fire({
						icon: 'warning',
						title: 'Phòng Đã Được Đặt Trước Trong Thời Gian Này!',
						type: 'warning',
						timer: '5000'
					})
				} else {
					Swal.fire({
						icon: 'success',
						title: 'Bạn Có Thể Đặt Phòng Trong Thời Gian Này! Vui Lòng Gọi HOTLINE:0327.299.456 ',
						type: 'success',
						timer: '5000'
					})
				}
			})
		}
	}
	$scope.pager = {
		page: 0,
		size: 10,
		get items() {
			var start = this.page * this.size;
			return $scope.phongFalse.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.phongFalse.length / this.size);
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
});


