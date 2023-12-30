app.controller("hoaDonDetail-ctrl", function($scope, $http) {
	$scope.items = [];
	$scope.itemsDpByKH = [];
	$scope.tongTienPhong = 0;
	$scope.itemsDP = {};
	$scope.itemsDV = [];
	$scope.form = { };
	$scope.formExportHD = {};
	$scope.chonDV = {};
	$scope.tongTienDV = 0;
	$scope.orderByMaDP = [];
	$scope.formAddDV = { };
	$scope.initialize = function() {
		$('.modal-backdrop').hide();
		$http.get("/HD/rest/hoadon/true").then(resp => {
			$scope.items = resp.data;
			$scope.items.forEach(item => {
				$http.get(`/HD/rest/datphong/${item.maDp}`).then(respGT => {
					item.maDp = respGT.data;
				}).catch(error => {
					console.log("Error", error);
				})
			})
			console.log(resp.data)
		})
	}
	$scope.initialize();
	$scope.listHDByTrue = function() {
		console.log("ok")
		/*$http.get("/rest/hoadon/true").then(resp => {
			$scope.items = resp.data;
			$scope.items.forEach(item => {
				$http.get(`/rest/datphong/${item.maDp}`).then(respGT => {
					item.maDp = respGT.data;
				}).catch(error => {
					console.log("Error", error);
				})
			})
			console.log(resp.data)
		})*/
	}
	$scope.viewDetail = function(item) {
		$scope.tongTienPhong = 0;
		$scope.tongTienDV = 0;
		$scope.orderByMaDP = [];
		console.log(item)
		item.ngayThanhToan = new Date(item.ngayThanhToan);
		$http.get(`/HD/rest/hoadon/ngay/${item.ngayThanhToan}`).then(respGT => {
			$scope.itemsDpByKH = respGT.data;
			console.log($scope.itemsDpByKH)
			$scope.itemsDpByKH.forEach(item => {
				$http.get(`/HD/rest/datphong/${item.maDp}`).then(respDP => {
					item.maDp = respDP.data
					item.ngayBD = new Date(item.maDp.ngayBD);
					item.ngayKT = new Date(item.maDp.ngayKT);
					item.gioTra = new Date(item.gioTraPhong);
					item.gioNhan = new Date(item.maDp.gioNhan);
					$scope.tongTienPhong = item.tienPhong + $scope.tongTienPhong;
					console.log($scope.tongTienPhong)
				})
				$http.get(`/HD/rest/orderDichVu/${item.maDp}`).then(respOrderByMP => {
					var data = respOrderByMP.data;
					$scope.orderByMaDP.push(...data)
					$scope.tongTienDV = 0;
					$scope.orderByMaDP.forEach(itemDV => {
						$scope.tongTienDV = (itemDV.maDichVu.donGia * itemDV.soLuong) + $scope.tongTienDV;
						itemDV = item;
					})
				})
				item.tongDV = $scope.tongTienDV;
			
			})
			$scope.form = {
						maKhachHang : item.maDp.maKhachHang.maKhachHang,
						hoTen: item.maDp.maKhachHang.hoTen
					};
			console.log($scope.itemsDpByKH)
		}).catch(error => {
			console.log("Error", error);
		})
	}
	$scope.generatePDF = function(item) {
		var element = document.getElementById('divToExport');
		var opt = {
			margin: 0.5,
			filename: 'hoadon - ' + item.hoTen + '.pdf',
			image: { type: 'jpeg', quality: 1 },
			html2canvas: { scale: 1 },
			jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait', precision: '12' }
		};
		html2pdf().set(opt).from(element).save();
		Swal.fire({
			icon: 'success',
			title: 'In Thành Công!',
			type: 'success',
			timer: '2000'
		})
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
		size: 20,
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
		size: 20,
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