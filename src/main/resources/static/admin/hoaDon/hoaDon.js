app.controller("inHoaDon-ctrl", function($scope, $http) {	
	$scope.items = [];
	$scope.itemsDP = [];
	$scope.form = {};
	$scope.orderByMaDP = [];
	$scope.initialize = function() {
		$('.modal-backdrop').hide();
		$scope.listHDByFalse();
	}
	$scope.listHDByFalse = function() {
			$http.get("/rest/hoadon/false").then(resp => {
			$scope.items = resp.data;
			$scope.items.forEach(item => {
				$http.get(`/rest/datphong/${item.maDp}`).then(respGT => {
					item.maDp = respGT.data;
					}).catch(error => {
						console.log("Error", error);
					})
			})
			console.log(resp.data)
			})	
	}
	$scope.viewDetail = function(item) {
			$scope.listOrderDV(item);
	}
	$scope.listOrderDV = function(item) {
		$http.get(`/rest/orderDichVu/${item.maDp.maDatPhong}`).then(respOrderByMP => {
			
			$scope.orderByMaDP = respOrderByMP.data;
			console.log($scope.orderByMaDP)
			$scope.tongTienDV = 0;
			$scope.orderByMaDP.forEach(itemDV => {
				$scope.tongTienDV = (itemDV.maDichVu.donGia * itemDV.soLuong) + $scope.tongTienDV;
			})
			item.ngayBD = new Date(item.maDp.ngayBD);
			item.ngayKT = new Date(item.maDp.ngayKT);
			item.tongDV = $scope.tongTienDV;
			$scope.form = item;
			console.log($scope.form)
		})

	}
	$scope.initialize();
	$scope.generatePDF = function(item) {
		var element = document.getElementById('divToExport');
        var opt = {
            margin:       0.5,
            filename:     'hoadon - '+item.maDp.maKhachHang.hoTen+'.pdf',
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { scale: 1 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait',precision: '12' }
          };
        html2pdf().set(opt).from(element).save();
        $http.get(`/rest/hoadon/${item.maHoaDon}`).then(resp => {
			var hoaDon = resp.data;
			console.log(hoaDon)
			hoaDon.trangThai = true;
			$http.put(`/rest/hoadon/${hoaDon.maHoaDon}`, hoaDon).then(respUpPhong => {						
						console.log("Chuyển trạng thái");
						var index = $scope.items.findIndex(p => p.maHoaDon == hoaDon.maHoaDon);
						$scope.items.splice(index, 1);
					}).catch(error => {
						console.log("Error", error);
					})
		})
		
        Swal.fire({
					icon: 'success',
					title: 'In Lại Thành Công!',
					type: 'success',
					timer: '2000'
				})
		$('#exampleModal').modal('hide');
		$('.modal-backdrop').hide();
		
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