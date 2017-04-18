'use strict';

angular.module('myApp.view2', ['ngRoute', 'n3-line-chart'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', function($scope) {
  $scope.url = "http://swan.pervasivenation.com/api/v1/iotdata/meta-data";

  // Call for API that was first discussed.
  $scope.add = function(){
    $http.get($scope.url,{
        headers: {"Authorization":"Bearer 1aEhW4pRMtQlODXEwKwytKfikNF8O6PyttGjWGBaLxu3e3GMD1CWblSYDArIoTwhAHeSSs3doIYlXoMxltKeM2Y04fvCYqtjkhoCffzjJH2CF6VCiOsQNpsmudf3W3U8YVZ72Z3ceJOqhAuCjkUDncjuYgpG7tHeVJFhH7Qb2MN23oMSCwvlDyTXxc0oWN6acSaUfoY0B7z5eaPT3GpM0wGVMXVrOfn5vIgxuxy9q99tTw37FDjYhjRriQo1dHIt"}
    }).then(function(response) {
            $scope.newMessage = response.data;
            $scope.messages.push($scope.newMessage);
    });
  }

  $scope.data = {
    dataset0: [
      {x: 0, val_0:13, val_1:30, val_2:0, val_3:40, val_4:18, val_5:2, val_6:20, val_7:9},
      {x: 1, val_0:7, val_1:32, val_2:4, val_3:41, val_4:18, val_5:1, val_6:20, val_7:10},
      {x: 2, val_0:5, val_1:31, val_2:3, val_3:40, val_4:16, val_5:2, val_6:21, val_7:11},
      {x: 3, val_0:-2, val_1:33, val_2:7, val_3:39, val_4:18, val_5:5, val_6:23, val_7:12},
      {x: 4, val_0:4, val_1:30, val_2:12, val_3:40, val_4:19, val_5:4, val_6:24, val_7:15},
      {x: 5, val_0:7, val_1:37, val_2:14, val_3:42, val_4:17, val_5:5, val_6:20, val_7:11},
      {x: 6, val_0:14, val_1:39, val_2:13, val_3:42, val_4:15, val_5:7, val_6:21, val_7:13},
      {x: 7, val_0:20, val_1:35, val_2:13, val_3:41, val_4:16, val_5:4, val_6:30, val_7:12},
      {x: 8, val_0:23, val_1:33, val_2:8, val_3:43, val_4:20, val_5:3, val_6:26, val_7:14},
      {x: 9, val_0:21, val_1:33, val_2:9, val_3:49, val_4:21, val_5:2, val_6:28, val_7:12},
      {x: 10, val_0:20, val_1:32, val_2:12, val_3:48, val_4:19, val_5:4, val_6:33, val_7:10}
    ]
  }

  $scope.options1 = {
    series:[
      {
        axis: "y",
        dataset: "dataset0",
        key:"val_0",
        label: "temperature",
        color: "#1f77b4",
        type:['line','dot','area'],
        id: "device_7_t"
      },
      {
        axis: "y",
        dataset: "dataset0",
        key:"val_1",
        label: "humidity",
        color: "#fc55a3",
        type:['line','dot','area'],
        id: "device_7_h"
      }
    ],
    axes: {x:{key:"x"}, type: 'date', ticks: [0, 100]}
  };

  $scope.options2 = {
    margin:{top:5},
    series:[
      {
        axis: "y",
        dataset: "dataset0",
        key:"val_2",
        label: "temperature",
        color: "#1f77b4",
        type:['line','dot','area'],
        id: "device_7_t"
      },
      {
        axis: "y",
        dataset: "dataset0",
        key:"val_3",
        label: "humidity",
        color: "#fc55a3",
        type:['line','dot','area'],
        id: "device_7_h"
      },
    ],
    axes: {x:{key:"x"}}
  };

  $scope.options3 = {
    margin:{top:5},
    series:[
      {
        axis: "y",
        dataset: "dataset0",
        key:"val_4",
        label: "temperature",
        color: "#1f77b4",
        type:['line','dot','area'],
        id: "device_7_t"
      },
      {
        axis: "y",
        dataset: "dataset0",
        key:"val_5",
        label: "humidity",
        color: "#fc55a3",
        type:['line','dot','area'],
        id: "device_7_h"
      },
    ],
    axes: {x:{key:"x"}}
  };

  $scope.options4 = {
    margin:{top:5},
    series:[
      {
        axis: "y",
        dataset: "dataset0",
        key:"val_6",
        label: "temperature",
        color: "#1f77b4",
        type:['line','dot','area'],
        id: "device_7_t"
      },
      {
        axis: "y",
        dataset: "dataset0",
        key:"val_7",
        label: "humidity",
        color: "#fc55a3",
        type:['line','dot','area'],
        id: "device_7_h"
      },
    ],
    axes: {x:{key:"x"}}
  };

});