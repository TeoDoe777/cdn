
    var currenuid = null;
    Dropzone.options.upload = {
        paramName: 'zipFileData',
        autoProcessQueue: true,
        parallelUploads: 1,
        maxFiles: 20,
        maxFilesize: 30256,
        chunking: true,
        forceChunking: true,
        parallelChunkUploads: false,
        chunkSize: 999999999999,
        retryChunks: true,
        retryChunksLimit: 20,
        chunksUploaded: function (file, done) {
            const params = "?uuid=" + file.upload.uuid
                + "&name=" + encodeURIComponent(file.name)
                + "&size=" + file.size;

            $.ajax({
                type: "GET",
                url: "/file-process" + params,
                success: function (data) {
                    done();
                },
                error: function (msg) {
                }
             });
        },
        timeout: 999999999999,
        dictMaxFilesExceeded: "You can not upload any more files.",
        dictFileTooBig: "File is too big (MiB). Max filesize: MiB.",
        dictResponseError: "Server responded with  code.",
        acceptedFiles: ".exe,.zip,.7z,.rar,.tar,.esp,.pkg,.package,.esm,.sims3pack,.scs,.mcpack,.mcaddon,.mctemplate,.mcworld,.pak,.apk,.jar,.torrent,.001,.002,.mpk,.cus",
        init: function () {
            this.on('queuecomplete', function (file) {
                window.location.href = '/files';
            });

            this.on("error", function (file, errorMessage) {
                if (errorMessage.message) {
                    alert("Upload has been canceled because of a file error.\n\nFile : "+file.name+"\n\nError : "+errorMessage.message+"\nPossible Solution : Try zipping the file on your computer and add the zipped file instead.");
                } else {
                    alert(errorMessage);
                }
            });
            this.on("canceled", function (file) {
                const params = "?uuid=" + file.upload.uuid;

                $.ajax({
                    type: "GET",
                    url: "/file-cancel" + params,
                    success: function (data) {},
                    error: function (msg) {}
                });
            });

                    this.on("addedfile", function(file) {
            // Create the remove button
            var removeButton = Dropzone.createElement('<i id="removeb" class="feather icon-x bg-c-pink card1-icon"></i>');

            //var showspeed = Dropzone.createElement('<div class="spdblockjsd"><span id="showspeedb" class="label label-primary"></span></div>');
            //file.previewElement.appendChild(showspeed);

            //var showprecentb = Dropzone.createElement('<span id="showspercentb2"></span>');
            //file.previewElement.appendChild(showprecentb);

            // Capture the Dropzone instance as closure.
            var _this = this;
            // Listen to the click event
            removeButton.addEventListener("click", function(e) {
                // Make sure the button click doesn't submit the form:
                e.preventDefault();
                e.stopPropagation();
                // Remove the file preview.
                _this.removeFile(file);
                // If you want to the delete the file on the server as well,
                // you can do the AJAX request here.
            });
            // Add the button to the file preview element.
            file.previewElement.appendChild(removeButton);
            $('.add-more-files').css('display', 'block');
            // Check for duplicate files
            if (this.files.length) {
                var _i, _len;
                for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) // -1 to exclude current file
                {
                    if (this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString()) {
                        this.removeFile(file);
                    }
                }
            }
        });

        this.on('uploadprogress', (file, progress, bytesSent) => {
            var time = Date.now() - this.timeStamp;
            var percent = (progress - this.prevProgress) / 100;
            var chunk = percent * file.size;
            var speed = ((chunk / 1024 / 1024) / (time / 1000)).toFixed(2);
            this.timeStamp = Date.now();
            this.prevProgress = progress;
            this.speed = speed;
            var upplos = bytesSent/1024/1024;

            //$("#showspeedb").html("Uploaded: "+upplos.toFixed(2)+" MB");
        });

                // Total Progress
        this.on("totaluploadprogress", function(progress, totalBytes, totalBytesSent) {
            var allProgress = 0;
            var allFilesBytes = 0;
            var allSentBytes = 0;

            for(var a=0;a<this.files.length;a++) {
                allFilesBytes = allFilesBytes + this.files[a].size;
                allSentBytes = allSentBytes + this.files[a].upload.bytesSent;
                allProgress = (allSentBytes / allFilesBytes) * 100;
            }

            var prghj = allProgress.toFixed(2);

            if(allSentBytes <= allFilesBytes){
                var allfbymb = allSentBytes/1024/1024;
                $("#showspeedb").html(prghj+"%");
                $("#showspercentb").html('<div class="progress" style="height: 30px;"> <div class="progress-bar" role="progressbar" style="width: '+prghj+'%;" aria-valuenow="'+prghj+'" aria-valuemin="0" aria-valuemax="100">'+allfbymb.toFixed(2)+' MB - '+prghj+'%</div></div>');
                //$('.total-uploaded-data').html( filesize(allSentBytes) +"/"+filesize(allFilesBytes) );
            }
            if(allProgress >= 100){
                //$('.total-uploaded-data').html( filesize(allFilesBytes) +"/"+filesize(allFilesBytes) );
                //alert('Файл загрузился 1');
                $("#showspercentb").html('<center><div class="alert alert-success" role="alert"> <strong>Done!</strong> Your file(s) has been successfully uploaded.</div></center>');
                $("#showspeedb").html("Speed: 0 MB/s");
                //alert('Файл загрузился 1');
            }
            window.totalProgressDone = allProgress;
            //$('.upload-progress-style').css('width', allProgress+'%').attr('aria-valuenow', allProgress);

            if (window.totalProgressDone >= 100){
                //$('.upload-sub-text').html('Preparing...');
                //$('.upload-progress-style').addClass('done');
                $("#showspercentb").html('<center><div class="alert alert-warning bg-warning text-white" role="alert"> <strong>Preparing, wait...</strong> File(s) have been successfully uploaded, our server need some time to proceed chunked parts of the data (1-70 seconds). </div></center>');

                //alert('Файл загрузился 2');
            }


        });

        this.on('queuecomplete', function (file) {
                    $("#showspercentb").html('<center><div class="alert alert-success" role="alert"> <strong>Done!</strong> Your file(s) has been successfully uploaded.</div></center>');
                    //alert('Перезагрузка страницы');
                    //window.location.reload(false);
                    window.location.href = '/files';
                });

        },


    };
