app.controller("khachhang-ctrl", function($scope, $http) {	
	$scope.items = [];
	$scope.form = {};
	$scope.roles = [];
	$scope.sortType = 'username';
	$scope.sortReverse = false;
	$scope.searchName = '';
//	let z = document.getElementById('quyendaglg');
//	let t = z.textContent;
//	$scope.role = t;
	$scope.initialize = function() {
		$('.modal-backdrop').hide();
		$http.get("/HD/rest/customers").then(resp => {
			$scope.items = resp.data;
			$scope.items.forEach(item => {
				item.ngaySinh = new Date(item.ngaySinh)
			})
		})
		
	}

	$scope.initialize();


	$scope.reset = function() {
		$scope.form = {}
	};


	$scope.edit = function(item) {
		$scope.form = angular.copy(item);		
	}

	$scope.create = function() {
		var mauSoCC = /^[0-9]{9,12}$/
		var mauSDT = /^[0-9]{10,11}$/
		var hoTenRegex = /^.+$/;

		var item = angular.copy($scope.form);
			var index = $scope.items.findIndex(p => p.maKhachHang == item.maKhachHang);
			if(!mauSoCC.test(item.soCC)){
					Swal.fire({
					icon: 'warning',
					title: 'Bạn Đã Nhập Sai CMND/CCCD !',
					type: 'warning',
					timer: '2000'
						})
			}else if(!mauSDT.test(item.sdt)){
					Swal.fire({
					icon: 'warning',
					title: 'Bạn Đã Nhập Sai Số Điện Thoại !',
					type: 'warning',
					timer: '2000'
						})
						
			}else	if (!hoTenRegex.test(item.hoTen)) {
				  Swal.fire({
				    icon: 'warning',
				    title: 'Họ tên không được để trống!',
				    type: 'warning',
				    timer: 2000
				  });
			}else if (index == -1) {	
				$http.post('/HD/rest/customers', item).then(resp => {
					var newKh = resp.data;
					newKh.ngaySinh = new Date(newKh.ngaySinh)
					$scope.items.push(newKh);
					$scope.reset();
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

	$scope.update = function() {
		var item = angular.copy($scope.form);
		item.maKhachHang + "";
		var index = $scope.items.findIndex(p => p.maKhachHang == item.maKhachHang);
		if (index == -1) {	
			Swal.fire({
				icon: 'error',
				title: 'Không tìm thấy khách hàng!',
				type: 'error',
				timer: '2000'
					})
				}
		else{
			if(item.maKhachHang != null){
				var index2 = $scope.items.findIndex(p => p.maKhachHang == item.maKhachHang);	
				$http.put(`/HD/rest/customers/${item.maKhachHang}`, item).then(resp => {
					var index = $scope.items.findIndex(p => p.id == item.id);
					$scope.items[index] = item;
					Swal.fire('Cập nhật thành công', '', 'success')
					$scope.reset();
				}).catch(error => {
					Swal.fire('Cập nhật thất bại', '', 'error')
					console.log("Error", error);
				})
			}else{
					Swal.fire('Cập nhật thất bại không tìm thấy người dùng cần cập nhật.', '', 'warning')
					console.log("Warning", error);
			}
		}
	}
	$scope.delete = function(item) {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-success',
				cancelButton: 'btn btn-danger'
			},
			buttonsStyling: false
		})
		swalWithBootstrapButtons.fire({
			title: 'Bạn có chắc muốn xóa nó không?',
			text: "Xóa tài khoản",
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Yes',
			cancelButtonText: 'No',
			reverseButtons: true
		}).then((result) => {
			if (result.isConfirmed) {
				if(item.maKhachHang != null){
					item.isDisable = true;
					$http.put(`/HD/rest/customers/${item.maKhachHang}`, item).then(resp => {
					var index = $scope.items.findIndex(p => p.maKhachHang == item.maKhachHang);
					$scope.items.splice(index, 1);
					Swal.fire('Xóa thành công', '', 'success')
				$scope.reset();
				}).catch(error => {
					Swal.fire({
					icon: 'error',
					title: 'Xóa Thất Bại!',
					type: 'error',
					timer: '2000'
						})
					console.log("Error", error);
				})
				
				}else{
					Swal.fire({
					icon: 'error',
					title: 'Không tìm thấy khách hàng cần xóa!',
					type: 'error',
					timer: '2000'
						})
					console.log("Warning", error);
				}
			}
		})

	}
	$scope.pager = {
		page: 0,
		size: 5,
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