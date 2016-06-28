'use strict';

/* App Module */
var common_module_app = angular.module('common_module_app', ['ui.router','angularValidator','ngCookies','ui.bootstrap','ngFileUpload','ui.tinymce']);



common_module_app.controller('header', function($scope,$state,$cookieStore,$rootScope,contentservice,$uibModal) {

    var scroll_pos = 0;

    $(document).scroll(function() {
        scroll_pos = $(this).scrollTop();
        if(scroll_pos > 112) {
            $("body").addClass('menufixed');
        } else {
            $("body").removeClass('menufixed');
        }
    });




    $rootScope.items = ['item1', 'item2', 'item3'];
    $scope.pagename = $state.current.name;
    $rootScope.rootUserid='';

    if(typeof ($cookieStore.get('userid'))!='undefined'){

        $rootScope.rootUserid=$cookieStore.get('userid');
    }else{
        $(".editableicon ").remove();
    }

    $scope.loginopen=function(){
        $uibModal.open({
            animation: true,
            templateUrl: 'loginmodal.html',
            controller: 'ModalInstanceCtrl',
            size: 'md',
            scope: $rootScope,
            resolve: {
                items: function () {
                    return true;
                }
            }
        });
    }






});



common_module_app.controller('logout', function($scope,$state,$cookieStore,$rootScope,contentservice) {

    $cookieStore.remove('userid');
    $cookieStore.remove('userdet');

    $state.go('home');
    return;

}) ;


common_module_app.controller('home', function($http,$scope,$state,$cookieStore,$rootScope,contentservice,$uibModal) {

    $scope.predicate = 'priority';
    $scope.reverse = false;

    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'stafflist',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.itemList=data;
    });

    $scope.getUrlName = function(title){
        title = title.replace(/\s+/g, '-');
        title = title.toLowerCase();

        return title;
    }


    $scope.functionscroll=function(){
        $('html, body').animate({
            scrollTop: parseInt($(".homeaboutblock").offset().top)-111
        }, 2000);
    }



    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'bannerlist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.bannerlist = data;
    });


    $scope.valsc=0;
    $('#carousel-example-generic').hide();
    $('link[href="css/animate.min.css"]').prop('disabled', false);
    /*item.active .homebannerblock {
     transition: transform 5000ms linear 0s;
     *//* This should be based on your carousel setting. For bs, it should be 5second*//*
     transform: scale(1.05, 1.05);*/
    //$('.item').eq(0).addClass('active');
    //$('#carousel-example-generic').carousel('next');
    setTimeout(function(){
        $('.item:first').addClass('active');


        //$("#myCarousel").carousel('destroy');
        //$('#carousel-example-generic').carousel();
        //$('#carousel-example-generic').carousel('next');


        var t;

        var start = $('#carousel-example-generic').find('.active').attr('data-interval');
        t = setTimeout("$('#carousel-example-generic').carousel({interval: 1000});", start-1000);

        $('#carousel-example-generic').on('slid.bs.carousel', function (e) {

            var slideFrom = $(this).find('.active').index();
            var slideTo = $(e.relatedTarget).index();
            var c=$('.item').length;
            if(slideFrom==c-1) {
                //$('.item').eq(0).hide();
                /* $('.item').eq(0).removeClass('active');
                 $('.item').eq(1).addClass('active');*/

                setTimeout(function(){
                    $('#carousel-example-generic').carousel(1);
                    $('link[href="css/animate.min.css"]').prop('disabled', true);

                },8100);
                //$('.item').eq(0).show();
                console.log(slideFrom+' => '+slideTo+'c=='+c+'slideFrom='+slideFrom);
            }
            if(slideFrom==1) {
                //$('.item').eq(0).hide();
                /* $('.item').eq(0).removeClass('active');
                 $('.item').eq(1).addClass('active');*/

                setTimeout(function(){
                    $('#carousel-example-generic').carousel(2);
                    console.log(slideFrom+' => '+slideTo+'c=='+c+'slideFrom='+slideFrom+'ccccccccccccccccccc55');


                },8100);
                //$('.item').eq(0).show();

            }

            clearTimeout(t);
            var duration = $(this).find('.active').attr('data-interval');

            $('#carousel-example-generic').carousel('pause');
            t = setTimeout("$('#carousel-example-generic').carousel();", duration-1000);
        });


        $('.carousel-control.right').on('click', function(){
            clearTimeout(t);
        });

        $('.carousel-control.left').on('click', function() {
            clearTimeout(t)
        });

        $('#carousel-example-generic').carousel(1);
        $('#carousel-example-generic').carousel(1);
        $('#carousel-example-generic').show();

        var c=$('.item').length;

        $('#carousel-example-generic').on('slide',function(e){
            var slideFrom = $(this).find('.active').index();
            var slideTo = $(e.relatedTarget).index();
            if(slideFrom==c-2) {
                //$('.item').eq(0).hide();
                $('.item').eq(0).removeClass('active');
                $('.item').eq(1).addClass('active');
                $('#carousel-example-generic').carousel(1);
                //$('.item').eq(0).show();
                console.log(slideFrom+' => '+slideTo+'c=='+c+'slideFrom='+slideFrom+'ccccccccccccccc1');
            }

        });






    },3000);


});


common_module_app.controller('areasofexpertise', function($scope,$state,$cookieStore,$rootScope,contentservice) {



}) ;
common_module_app.controller('staff', function($scope,$state,$cookieStore,$rootScope,contentservice,$http ) {

    $scope.predicate = 'priority';
    $scope.reverse = false;

    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'stafflist',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.itemList=data;
    });

    $scope.getUrlName = function(title){
        title = title.replace(/\s+/g, '-');
        title = title.toLowerCase();

        return title;
    }

}) ;

common_module_app.controller('staffdetails', function($scope,$state,$cookieStore,$rootScope,contentservice,$http,$stateParams,$sce ) {

    $scope.trustAsHtml = $sce.trustAsHtml;

    $scope.id=$stateParams.id;
    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'staffdetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.itemDet=data[0];
    });



}) ;

common_module_app.controller('contact', function($scope,$state,$cookieStore,$rootScope,contentservice,$http,$uibModal,$timeout) {

    $scope.contactsubmit = function(){
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'addcontact',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;


            var uinmodIns = $uibModal.open({
                animation: true,
                templateUrl: 'contactsuccess.html',
                size: 'lg',
                scope:$scope
            });

            $timeout(function(){
                uinmodIns.dismiss('cancel');
                $scope.contactform.reset();

            },5000);

        });
    }


    $scope.loginopen=function(){
        $uibModal.open({
            animation: true,
            templateUrl: 'loginmodal.html',
            controller: 'ModalInstanceCtrl',
            size: 'md',
            scope: $rootScope,
            resolve: {
                items: function () {
                    return true;
                }
            }
        });
    }



}) ;

common_module_app.controller('mediaarticles', function($scope,$state,$cookieStore,$rootScope,contentservice,$http,$sce,$timeout) {
    $scope.govideo=function(){
        $state.go('media-video');
    }
    $scope.goarticle=function(){
        $state.go('media-articles');
    }


    $(window).load( function(){
        console.log(0);
        stLight.options({publisher: "45137db7-8b13-453d-a8c8-ac5d36794d2e", doNotHash: false, doNotCopy: false, hashAddressBar: false});
    });

    setInterval(function(){
        console.log(1);
        stLight.options({publisher: "45137db7-8b13-453d-a8c8-ac5d36794d2e", doNotHash: false, doNotCopy: false, hashAddressBar: false});
    },4000);


   if($rootScope.previousState != ''){
        window.location.href = $scope.baseUrl +'media-articles';
    }

    $scope.trustAsHtml = $sce.trustAsHtml;


    $scope.predicate = '_id';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.currentPage=1;
    $scope.perPage=2;

    $scope.totalItems = 0;

    $scope.getNumpages = function(noofitems){
        $scope.totalNumPage = (noofitems / $scope.perPage);
        if($scope.totalNumPage > parseInt($scope.totalNumPage)){
            $scope.totalNumPage = parseInt($scope.totalNumPage)+1;
        }

        return $scope.totalNumPage;
    }

    $scope.filterResult = [];

    $scope.tooltipon = true;

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'articlelist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        $scope.medialist=data;

        $scope.totalArticles = 0;
        angular.forEach(data,function(value){
            if(value.status == 1){
                $scope.totalArticles = parseInt($scope.totalArticles)+1;
            }
        });

        $timeout(function(){
            $scope.tooltipon = false;
        },5000)

    });

    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'medialist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {

        $scope.totalVideos = 0;
        angular.forEach(data,function(value){
            if(value.status == 1){
                $scope.totalVideos = parseInt($scope.totalVideos)+1;
            }
        })

    });

    $scope.getNumpages = function(noofitems){
        $scope.totalNumPage = (noofitems / $scope.perPage);
        if($scope.totalNumPage > parseInt($scope.totalNumPage)){
            $scope.totalNumPage = parseInt($scope.totalNumPage)+1;
        }

        return $scope.totalNumPage;
    }





}) ;

common_module_app.controller('mediaarticlesdetails', function($scope,$state,$cookieStore,$rootScope,contentservice,$http,$sce,$stateParams) {

    $scope.id=$stateParams.id;

    $scope.trustAsHtml = $sce.trustAsHtml;

    if($rootScope.previousState != ''){
        window.location.href = $scope.baseUrl +'articles-details/'+$scope.id;
    }

    $scope.getNumpages = function(noofitems){
        $scope.totalNumPage = (noofitems / $scope.perPage);
        if($scope.totalNumPage > parseInt($scope.totalNumPage)){
            $scope.totalNumPage = parseInt($scope.totalNumPage)+1;
        }

        return $scope.totalNumPage;
    }

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'articlelist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {

        $scope.totalArticles = 0;
        angular.forEach(data,function(value){
            if(value.status == 1){
                $scope.totalArticles = parseInt($scope.totalArticles)+1;
            }
        })

    });

    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'medialist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {

        $scope.totalVideos = 0;
        angular.forEach(data,function(value){
            if(value.status == 1){
                $scope.totalVideos = parseInt($scope.totalVideos)+1;
            }
        })

    });


    $http({
        method  : 'POST',
        async:   false,
        url     :     $scope.adminUrl+'articledetails',
        data    : $.param({'id':$scope.id}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.itemDet = data[0];

    });
}) ;

common_module_app.controller('mediavideo', function($scope,$state,$cookieStore,$rootScope,$http,contentservice) {

    $scope.govideo=function(){
        $state.go('media-video');
    }
    $scope.goarticle=function(){
        $state.go('media-articles');
    }
    $scope.predicate = '_id';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.currentPage=1;
    $scope.perPage=4;

    $scope.totalItems = 0;

    $scope.getNumpages = function(noofitems){
        $scope.totalNumPage = (noofitems / $scope.perPage);
        if($scope.totalNumPage > parseInt($scope.totalNumPage)){
            $scope.totalNumPage = parseInt($scope.totalNumPage)+1;
        }

        return $scope.totalNumPage;
    }

    $scope.filterResult = [];
    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'medialist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        // console.log(data);
        $scope.medialist=data;
        console.log($scope.medialist);
        // $scope.medialistp = $scope.medialist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

        $scope.totalVideos = 0;
        angular.forEach(data,function(value){
            if(value.status == 1){
                $scope.totalVideos = parseInt($scope.totalVideos)+1;
            }
        })

    });

    $http({
        method  : 'POST',
        async:   false,
        url     : $scope.adminUrl+'articlelist',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $scope.totalArticles = 0;
        angular.forEach(data,function(value){
            if(value.status == 1){
                $scope.totalArticles = parseInt($scope.totalArticles)+1;
            }
        })

    });

    $scope.vidoopen=function(item){
        //$('iframe').attr('src', $('iframe').attr('src'));
       /* $('iframe').each(function ()
        {
            this.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*')

        });*/

        $('.media-video-list-new').find('.videodiv').empty();

        $('.imgdiv').show();


        $('#'+item._id).find('.videodiv').html('<div class="videoWrappernew"><iframe id="if'+item._id+'" width="560" height="349"  src="https://www.youtube.com/embed/'+item.media_file+'?enablejsapi=1&version=3&playerapiid=ytplayer&autoplay=1" frameborder="0" allowfullscreen ></iframe></div>');

        $('#'+item._id).find('.imgdiv').hide();

    }


}) ;

common_module_app.controller('probono', function($scope,$state,$cookieStore,$rootScope,contentservice) {



}) ;
