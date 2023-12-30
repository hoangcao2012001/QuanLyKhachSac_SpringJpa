app = angular.module("admin-app", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
        .when("/phong", {
           templateUrl:"/HD/admin/phong/index.html",
            controller: "phong-ctrl"
        })
         .when("/khachhang", {
           templateUrl:"/HD/admin/khachhang/index.html",
            controller: "khachhang-ctrl"
        })
        .when("/home", {
            templateUrl:"/HD/admin/home/index.html",
           controller: "home-ctrl"
        })
         .when("/datphong", {
            templateUrl:"/HD/admin/datPhong/index.html",
           controller: "datphong-ctrl"
        })
         .when("/dichvu", {
            templateUrl:"/HD/admin/dichVu/index.html",
           controller: "dichvu-ctrl"
        })
         .when("/loaiphong", {
            templateUrl:"/HD/admin/loaiPhong/index.html",
           controller: "loaiphong-ctrl"
        })
        .when("/promotion", {
            templateUrl:"/HD/admin/promotion/index.html",
           controller: "promotion-ctrl"
        })
         .when("/detailHoaDon", {
            templateUrl:"/HD/admin/hoaDon/detail.html",
           controller: "hoaDonDetail-ctrl"
        })
         .when("/orderDV", {
            templateUrl:"/HD/admin/orderDichVu/index.html",
           controller: "orderDV-ctrl"
        })
         .when("/traphong", {
            templateUrl:"/HD/admin/traPhong/index.html",
           controller: "traphong-ctrl"
        })
        
       .otherwise({
            templateUrl:"/HD/admin/home/index.html",
            controller: "home-ctrl"
        }); 
});
