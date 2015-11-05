angular.module('chat').controller('ChatController', ['$scope', 'Socket', function($scope, Socket)
{
    $scope.messages = [];

    Socket.on('chatMessage', function(message)
    {
        console.log('Recieved Message: ' + message.text)
        $scope.messages.push(message);
    });

    this.sendMessage = function()
    {
        var message = {
            text: this.messageText
        };

        Socket.emit('chatMessage', message);

        this.messageText = '';
    };

    $scope.$on('$destroy', function()
    {
        Socket.removeListener('chatMessage');
    });


}]);
