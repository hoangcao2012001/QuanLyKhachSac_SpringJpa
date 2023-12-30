app.controller("traphong-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.itemsDpByKH = [];
	$scope.tongTienPhong = 0;
	$scope.itemsDP = {};
	$scope.itemsDV = [];
	$scope.form = { gioTra: new Date() };
	$scope.formExportHD = {};
	$scope.chonDV = {};
	$scope.tongTienDV = 0;
	$scope.orderByMaDP = [];
	$scope.formAddDV = { ngayOrder: new Date() };
	$scope.initialize = function() {
		$scope.listDPByTrangThai();
		$('.modal-backdrop').hide();
	}
	$scope.listDPByTrangThai = function() {
		$http.get("/HD/rest/datphong/trangThai").then(respTT => {
			$scope.items = respTT.data;
		})
	}
	$scope.reset = function() {
		$scope.itemsDpByKH = [];
		$scope.tongTienPhong = 0;
		$scope.itemsDP = {};
		$scope.itemsDV = [];
		$scope.form = { gioTra: new Date() };
		$scope.formExportHD = {};
		$scope.chonDV = {};
		$scope.tongTienDV = 0;
		$scope.orderByMaDP = [];
		$scope.formAddDV = { ngayOrder: new Date() };
	}
	const VND = new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	});
	const formatVND = new Intl.NumberFormat(undefined, {

	});
	$scope.chiTietDP = function(item) {
	}
	$scope.traPhong = function(item) {
		$scope.tongTienPhong = 0;
		$scope.tongTienDV = 0;
		$http.get(`/HD/rest/datphong/kh/${item.maKhachHang.maKhachHang}`).then(respKH => {
			$scope.itemsDpByKH = respKH.data;
			$scope.itemsDpByKH.forEach(item => {
				item.ngayBD = new Date(item.ngayBD);
				item.ngayKT = new Date(item.ngayKT);
				item.gioTra = new Date();
				item.gioNhan = new Date(item.gioNhan);
				var ngayTP = item.ngayKT.setHours(item.gioTra.getHours(), item.gioTra.getMinutes(), item.gioTra.getSeconds(), item.gioTra.getMilliseconds())
				var ngayNP = item.ngayBD.setHours(item.gioNhan.getHours(), item.gioNhan.getMinutes(), item.gioNhan.getSeconds(), item.gioNhan.getMilliseconds())
				var timeThue = ngayTP - ngayNP; // ms 
				var tienPhong = item.maPhong.giaPhong / (24 * 60);
				item.tienPhong = Math.ceil(timeThue / (1000 * 60)) * Math.ceil(tienPhong);
				$scope.tongTienPhong = item.tienPhong + $scope.tongTienPhong
				console.log($scope.tongTienPhong)
				item.gioTra.setSeconds(0);
				item.gioTra.setMilliseconds(0);
				$http.get(`/HD/rest/orderDichVu/${item.maDatPhong}`).then(respOrderByMP => {
					var data = respOrderByMP.data;
					$scope.orderByMaDP.push(...data)
					$scope.tongTienDV = 0;
					$scope.orderByMaDP.forEach(itemDV => {
						$scope.tongTienDV = (itemDV.maDichVu.donGia * itemDV.soLuong) + $scope.tongTienDV;
						itemDV = item;
					})
					item.tongDV = $scope.tongTienDV;
				})
				
				$scope.form = item;
			})
			
			console.log($scope.itemsDpByKH)
		})
	}
	
	$scope.initialize();
	$scope.exportHD = function(form) {
		$('#exampleModal').modal('hide');
		$('.modal-backdrop').hide();
		$scope.itemsDpByKH.forEach(item => {
			console.log(item)
			$scope.formExportHD.gioTraPhong = item.gioTra;
			$scope.formExportHD.maDp = item.maDatPhong;
			$scope.formExportHD.tienPhong = item.tienPhong;
			$scope.formExportHD.trangThai = true;
			$scope.formExportHD.ngayThanhToan = new Date();
			var createHD = angular.copy($scope.formExportHD);
			console.log(createHD)
			$http.post('/HD/rest/hoadon', createHD).then(resp => {
			var itemUpDP = {}
				itemUpDP = {
					maDatPhong: item.maDatPhong,
					trangThai: true
				}
				$http.get(`/HD/rest/datphong/${itemUpDP.maDatPhong}`, itemUpDP).then(respDP => {
					$scope.itemsDP = respDP.data;
					var itemDp = angular.copy($scope.itemsDP);
					itemDp.trangThai = false;
					$http.put(`/HD/rest/datphong/${itemDp.maDatPhong}`, itemDp).then(resp => {
						Swal.fire({
							icon: 'success',
							title: 'Thanh Toán Thành Công!',
							type: 'success',
							timer: '2000'
						})
						$scope.initialize();
					}).catch(error => {
						Swal.fire('Cập nhật thất bại', '', 'error')
						console.log("Error", error);
					})
				})
				console.log("Tạo HD Thành Công !")
				$scope.formExportHD = {};
			}).catch(error => {
				Swal.fire({
					icon: 'error',
					title: 'Lỗi Xuất HD!',
					type: 'error',
					timer: '2000'
				})
				console.log("Error", error);
			})

		})
		 $scope.generatePDF(form)
	}
	$scope.generatePDF = function(item) {
		var element = document.getElementById('divToExport');
		var opt = {
			margin: 0.5,
			filename: 'hoadon - ' + item.maKhachHang.hoTen + '.pdf',
			image: { type: 'jpeg', quality: 1 },
			html2canvas: { scale: 1 },
			jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait', precision: '12' }
		};
		html2pdf().set(opt).from(element).save();
		$('#exampleModal').modal('hide');
		$('.modal-backdrop').hide();

	}
	$scope.pagerKHDP = {
		page: 0,
		size: 5,
		get items() {
			var start = this.page * this.size;
			return $scope.itemsDpByKH.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.itemsDpByKH.length / this.size);
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
	$scope.pagerOrder = {
		page: 0,
		size: 100,
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