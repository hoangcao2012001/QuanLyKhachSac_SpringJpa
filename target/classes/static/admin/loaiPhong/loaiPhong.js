app.controller("loaiphong-ctrl", function($scope, $http) {	
	$scope.items = [];
	$scope.form = {image : 'cloud-upload.jpg'};	
//	let z = document.getElementById('quyendaglg');
//	let t = z.textContent;
//	$scope.role = t;
	$scope.initialize = function() {
		$http.get("/HD/rest/loaiphong").then(resp => {
			$scope.items = resp.data;
		})
		$('.modal-backdrop').hide();
	}

	$scope.initialize();


	$scope.reset = function() {
		$scope.form = {image : 'cloud-upload.jpg'}
	};

	$scope.imageChanged = function(files) {
		var data = new FormData;
		data.append('file', files[0]);
		$http.post('/HD/rest/upload/user/', data, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(resp => {
			$scope.form.image = resp.data.name;
		}).catch(error => {
			alert("loi upload");
			console.log("Error", error)
		})

	}
	$scope.edit = function(item) {
		$scope.form = angular.copy(item);		
	}

	$scope.create = function() {
		var item = angular.copy($scope.form);
			var index = $scope.items.findIndex(p => p.tenLoaiPhong == item.tenLoaiPhong);
			if (index == -1) {	
				$http.post('/HD/rest/loaiphong', item).then(resp => {
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
				title: 'Thêm Thất Bại Tên Loại Đã Tồn Tại!',
				type: 'warning',
				timer: '2000'
					})
				}
	}

	$scope.update = function() {
		var item = angular.copy($scope.form);
		var index = $scope.items.findIndex(p => p.maLoaiPhong == item.maLoaiPhong);
		if (index == -1) {	
			Swal.fire({
				icon: 'error',
				title: 'Không tìm thấy loại phòng!',
				type: 'error',
				timer: '2000'
					})
				}
		else{
			if(item.maLoaiPhong != null){
					$http.put(`/HD/rest/loaiphong/${item.maLoaiPhong}`, item).then(resp => {
						var index = $scope.items.findIndex(p => p.maLoaiPhong == item.maLoaiPhong);
						$scope.items[index] = item;
						Swal.fire('Cập nhật thành công', '', 'success')
						$scope.reset();
						$(".nav-pills a:eq(1)").tab('show')
					}).catch(error => {
						Swal.fire('Cập nhật thất bại', '', 'error')
						console.log("Error", error);
					})
			}else{
					Swal.fire('Cập nhật thất bại không tìm thấy loại phòng cần cập nhật.', '', 'warning')
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
				if(item.maLoaiPhong != null){
					item.isDisable = true;
					$http.put(`/HD/rest/loaiphong/${item.maLoaiPhong}`, item).then(resp => {
					var index = $scope.items.findIndex(p => p.maLoaiPhong == item.maLoaiPhong);
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
					title: 'Không tìm thấy loại phòng!',
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