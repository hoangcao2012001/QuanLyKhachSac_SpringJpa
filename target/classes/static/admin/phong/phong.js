app.controller("phong-ctrl", function($scope, $http) {	
	$scope.items = [];
	$scope.form = {tinhTrang : true};
	$scope.loaiPhong = {};
	$scope.roles = [];
//	let z = document.getElementById('quyendaglg');
//	let t = z.textContent;
//	$scope.role = t;
	$scope.initialize = function() {
		$('.modal-backdrop').hide();
		$http.get("/HD/rest/phong").then(resp => {
			$scope.items = resp.data;
			console.log($scope.items)
		})
		$http.get("/HD/rest/loaiphong").then(resp => {
			$scope.loaiPhong = resp.data;
			console.log($scope.loaiPhong)
		})
	}

	$scope.initialize();


	$scope.reset = function() {
		$scope.form = {tinhTrang : true}
	};


	$scope.edit = function(item) {
		$scope.form = angular.copy(item);	
		console.log($scope.form)	
	}

	$scope.create = function() {
		var mauGiaPhong = /^[0-9]{1,100}$/
		var item = angular.copy($scope.form);
		console.log(item)
			var index = $scope.items.findIndex(p => p.maPhong == item.maPhong);
			 
			  if(item.maLoaiPhong == null){
					Swal.fire({
					icon: 'warning',
					title: 'Bạn Phải Chọn Loại Phòng Trước Khi Thêm !',
					type: 'warning',
					timer: '2000'
						})
			}else if(!mauGiaPhong.test(item.giaPhong)){
					Swal.fire({
					icon: 'warning',
					title: 'Bạn Đã Nhập Sai Giá Phòng !',
					type: 'warning',
					timer: '2000'
						})
			}else if (index == -1) {	
				$http.post('/HD/rest/phong', item).then(resp => {
					$scope.items.push(resp.data);
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
				title: 'Thêm Thất Bại Phòng Đã Tồn Tại!',
				type: 'warning',
				timer: '2000'
					})
				}
	}

	$scope.update = function() {
		var item = angular.copy($scope.form);
		var checkTrangThai = angular.copy($scope.form);
		console.log(item)
		var index = $scope.items.findIndex(p => p.maPhong == item.maPhong);
		 if (index == -1) {	
			Swal.fire({
				icon: 'error',
				title: ' Trùng Mã Phòng!',
				type: 'error',
				timer: '2000'
					})				
		}else{
			if(item.maPhong != null){				
				$http.put(`/HD/rest/phong/${item.maPhong}`, item).then(resp => {
					var index = $scope.items.findIndex(p => p.maPhong == item.maPhong);
					$scope.items[index] = item;
					Swal.fire('Cập nhật thành công', '', 'success')
					$scope.reset();
				}).catch(error => {
					Swal.fire('Cập nhật thất bại', '', 'error')
					console.log("Error", error);
				})
			}else{
					Swal.fire('Cập nhật thất bại không tìm thấy phòng cần cập nhật.', '', 'warning')
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
				 if(item.maPhong != null){
					item.isDisable = true;
					$http.put(`/HD/rest/phong/${item.maPhong}`,item).then(resp => {
					var index = $scope.items.findIndex(p => p.maPhong == item.maPhong);
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
					title: 'Không tìm thấy phòng cần xóa!',
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