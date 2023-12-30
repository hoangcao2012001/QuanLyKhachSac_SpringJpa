app.controller("datphong-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.dataKH = [];
	$scope.dataDP = [];
	$scope.form = {};
	$scope.loaiPhong = {};
	$scope.phongFalse = [];
	$scope.phong = {};
	$scope.value = null;
	$scope.CountKH = null;
	$scope.formDP = {};
	//	let z = document.getElementById('quyendaglg');
	//	let t = z.textContent;
	//	$scope.role = t;
	$scope.initialize = function() {
		$('.modal-backdrop').hide();
		$scope.dataLP();
		$scope.dataKH();

	}
	$scope.dataLP = function() {
		$http.get("/HD/rest/loaiphong").then(resp => {
			$scope.loaiPhong = resp.data;
			console.log($scope.loaiPhong)
		})
	}
	$scope.dataKH = function() {
		$http.get("/HD/rest/customers").then(resp => {
			$scope.dataKH = resp.data;
			$scope.dataKH.forEach(item => {
				item.ngaySinh = new Date(item.ngaySinh)
			})
		})
	}
	$scope.initialize();

	$scope.reset = function() {
		$scope.items = [];
		$scope.form = {};
		$scope.loaiPhong = {};
		$scope.phong = {};
		$scope.value = null;
		$scope.dataKH = [];
		$scope.phongFalse = [];
		$scope.formDP = { gioNhan: new Date() };
	};
	$scope.seachPhong = function() {
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
	$scope.checkDP = function(item) {
		$http.get(`/HD/rest/datphong/${item.maPhong}/${item.ngayBD}/${item.ngayKT}`).then(resp => {
			$scope.dataDP = resp.data;
			console.log($scope.dataDP)

		})
	}
	$scope.createKH = function() {
		var mauSoCC = /^[0-9]{9,12}$/
		var mauSDT = /^[0-9]{10,11}$/
		var item = angular.copy($scope.form);
		var index = $scope.items.findIndex(p => p.maKhachHang == item.maKhachHang);


		if (!mauSoCC.test(item.soCC)) {
			Swal.fire({
				icon: 'warning',
				title: 'Bạn Đã Nhập Sai CMND/CCCD !',
				type: 'warning',
				timer: '2000'
			})
		} else if (!mauSDT.test(item.sdt)) {
			Swal.fire({
				icon: 'warning',
				title: 'Bạn Đã Nhập Sai Số Điện Thoại !',
				type: 'warning',
				timer: '2000'
			})
		} else if (index == -1) {
			$http.post('/HD/rest/customers', item).then(resp => {
				resp.data.createDate = new Date(resp.data.createDate)
				$('#exampleModal').modal('show');
				$('.modal-backdrop').hide();
				$('#exampleModal1').modal('hide');
				$scope.formDP.maKhachHang = $scope.form.maKhachHang
				$scope.form = {};
				$http.get("/HD/rest/customers").then(resps => {
					$scope.dataKH = resps.data;
					$scope.dataKH.forEach(item => {
						item.ngaySinh = new Date(item.ngaySinh)
					})
				})
				Swal.fire({
					icon: 'success',
					title: 'Thêm Thành Công!',
					type: 'success',
					timer: '2000'
				})
			}).catch(error => {
				Swal.fire({
					icon: 'error',
					title: 'Thêm Thất Bại!',
					type: 'error',
					timer: '2000'
				})
				console.log("Error", error);
			})
		} else {
			Swal.fire({
				icon: 'warning',
				title: 'Thêm Thất Bại Khách Hàng Đã Tồn Tại!',
				type: 'warning',
				timer: '2000'
			})
		}
	}
	$scope.createDP = function(p) {
		var item = angular.copy($scope.formDP);
		var itemDP = {
			maKhachHang: { maKhachHang: item.maKhachHang },
			maPhong: { maPhong: p.maPhong },
			ngayBD: item.ngayBD,
			ngayKT: item.ngayKT,
			gioNhan: item.gioNhan,
		}
		var checkNgayNhan = new Date();
		var index = $scope.dataKH.findIndex(p => p.maKhachHang == item.maKhachHang);
		if (index == -1) {
			console.log('không tìm thấy')
			$('#exampleModal').modal('hide');
			$('.modal-backdrop').hide();
			$('#exampleModal1').modal('show');
			$scope.form = { maKhachHang: item.maKhachHang };
		} else if (itemDP.maKhachHang.maKhachHang == null) {
			Swal.fire({
				icon: 'warning',
				title: 'Mã Khách Hàng Trống Vui Lòng Nhập Lại!',
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
		} else if (itemDP.ngayBD == null) {
			Swal.fire({
				icon: 'warning',
				title: 'Vui Lòng Chọn Ngày Nhận Phòng!',
				type: 'warning',
				timer: '2000'
			})
		} else if (itemDP.ngayKT == null) {
			Swal.fire({
				icon: 'warning',
				title: 'Vui Lòng Chọn Ngày Trả Phòng!',
				type: 'warning',
				timer: '2000'
			})
		} else if (itemDP.ngayKT < itemDP.ngayBD) {
			Swal.fire({
				icon: 'warning',
				title: 'Ngày Trả Phòng Phải >= Ngày Nhận!',
				type: 'warning',
				timer: '2000'
			})
		} else if (itemDP.gioNhan == null) {
			Swal.fire({
				icon: 'warning',
				title: 'Vui Lòng Chọn Giờ Nhận!',
				type: 'warning',
				timer: '2000'
			})
		}
		else {
			
			$http.get(`/HD/rest/datphong/${p.maPhong}/${itemDP.ngayBD}/${itemDP.ngayKT}`).then(resp => {
				var dataDP = resp.data;
				console.log($scope.dataDP)

				if (dataDP.length > 0) {
					Swal.fire({
						icon: 'warning',
						title: 'Phòng Đã Được Đặt Trong Thời Gian Này!',
						type: 'warning',
						timer: '2000'
					})
				} else {
					itemDP.trangThai = false;
					$http.post('/HD/rest/datphong', itemDP).then(resp => {
						console.log(resp.data);
						Swal.fire({
							icon: 'success',
							title: 'Đặt Phòng Thành Công!',
							type: 'success',
							timer: '2000'
						})
					}).catch(error => {
						Swal.fire({
							icon: 'error',
							title: 'Thêm Thất Bại!',
							type: 'error',
							timer: '2000'
						})
						console.log("Error", error);
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
})