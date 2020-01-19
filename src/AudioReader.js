// JavaScript Document

// constructor that reads a file
module.exports = class AudioReader {
	constructor(){
		this.totalFiles = 0;
		this.tagHeader = '';
		this.buffer = ''; // buffer
		
		this.tagData = {};
		//this.imageData = [];
		this.imageTagIndex = [];
		this.imageTagEnd = [];
		this.currentPosition = 0;
		this.id3Tags = [];
		this.fileNum = 0;
		this.files = null;
		
		this.AudioFile = {
			File:{}, // holds file
			ID:{}, // index and name
			Size:{}, // hold file size
			TextData: null, // holds data of file read as text
			TagData: null, //
			ImageData:{}, //
			Total:0,
			ID3Tag:{
				Version:{}, // id3 tag version
				Size: 0, //
				Title: '', // title of audio
				Author: '', // arthor / artist
				Author2: '', //
				Album: '', //
				Year: '', //
				Genre: '', //
				CoverArt: null
			} // end object ID3Tag
		}; // end object AudioFile

	} // end constructor Reader

	// read file
	async readFile(files) {
		this.fileNum = files.length;
		this.id3Tags = [];
		this.files = files;

		const file = files[this.currentPosition];
		this.processingUnit(file);
		this.buffer = '';
		
		return this.id3Tags;
	} // end method readFile

	looper() {
		if (this.currentPosition < this.fileNum) {
			this.processingUnit(this.files[this.currentPosition]);
		}
	}

	processingUnit(file) {
		let i = this.currentPosition;
		let {
			originalname,
			encoding,
			mimetype,
			buffer,
			size
		} = file;

		if (mimetype === 'audio/mpeg') {
			this.buffer = Buffer.from(buffer);
			this.tagHeader = this.buffer.slice(0, 10).buffer;
			this.processTagHeader();
			this.getFileTags();
			this.processTag();

			const fileData = {};
			fileData.originalname = originalname;
			fileData.mimeType = mimetype;
			fileData.size = size;
			fileData.id3Tag = this.AudioFile.ID3Tag;

			this.id3Tags.push(fileData);
		}

		this.refreshTags();
		this.files[i] = null;
		this.currentPosition += 1;
		this.looper();
	}

	refreshTags() {
		this.AudioFile = {
			File:{}, // holds file
			ID:{}, // index and name
			Size:{}, // hold file size
			TextData: null, // holds data of file read as text
			TagData: null, //
			ImageData:{}, //
			Total:0,
			ID3Tag:{
				Version:{}, // id3 tag version
				Size: 0, //
				Title: '', // title of audio
				Author: '', // arthor / artist
				Author2: '', //
				Album: '', //
				Year: '', //
				Genre: '', //
				CoverArt: null
			} // end object ID3Tag
		};
	}

	// get size of file(s) selectes
	/*getTotalFileSize(size){
		return ( size / ( 1024 * 1024 ) ).toFixed(2);
	}*/ // end method getFileSize

	// get tag size of file(s)
	/*getTagHeader(){
		const file = this.AudioFile;
		const i = this.currentFileNumber;
		const name = file.ID[i]
		let header = file.File[ name ].slice(0, 10);
		this.readArrayBuffer( header );
	}*/ // end method getTagSize

	// get all tags and tag data
	getFileTags(){
		const f = this.AudioFile;
		let size = f.ID3Tag.Size;
		const version = f.ID3Tag.Version;

		
		if( version === 3 || version === 4)
		{
			f.TagData = this.buffer.slice(10, size);
		}
	
	} // end method getFileTags

	// pad binary data with zeros to make 7 characters
	padZero( x ){
		if( x.length < 7 )
		{
			for( var i = x.length; i < 7; i++ )
			{
				x = "0" + x;
			}
			return  x;

		} else if( x.length == 8) {
			const a = x.substring(0, x.length )
			return a;
		} else if( x.length == 7 )
			return x;
	} // end method padZero

	// convert any number to any base
	base( n, to, from ){
			return parseInt ( n, from || 10 ) .toString ( to ) ;
	} // end method base

	// method sorts an array numerically
	/*sortNumArray(a, b){
		return a - b;
	}*/ // end method sortNumArray

	// process the tag sizes
	processTagHeader(){
		let header = ''
		let size = '';
		
		header = new DataView( this.tagHeader );
		const byteLen = header.byteLength;
		
		this.AudioFile.ID = String.fromCharCode( header.getInt8(0), header.getInt8(1), header.getInt8(2) );
		this.AudioFile.ID3Tag.Version = header.getInt8(3);
		size = this.padZero(this.base(this.base(header.getInt8(6), 16, 10), 2, 16))
			+this.padZero(this.base(this.base(header.getInt8(7), 16, 10), 2, 16))
			+this.padZero(this.base(this.base(header.getInt8(8), 16, 10), 2, 16))
			+this.padZero(this.base(this.base(header.getInt8(9), 16, 10), 2, 16));
		
		this.AudioFile.ID3Tag.Size = this.base(size, 10, 2);	
	} // end method processTagSize

	// get tag data
	getTagData( startPoint, view ){
		const jj = 4 + startPoint;
		const tagContent = this.getTextTagData( jj, view);
		return tagContent;
	} // end method getTagData

	// get the content of text tags like Title, Album, etc
	getTextTagData( startPoint, view ){
		let tagSize = '';
		for( let s = 0; s < 4; s++ ){
			let t = view.getInt8( startPoint + s );
			t = this.base( t, 16, 10);
			t = this.padZero( this.base( t, 2, 16 ) );
			tagSize += t;
		}
		tagSize = this.base( tagSize, 10, 2);
		this.currentTagSize = parseInt( tagSize, 10 );
		let tagContent = '';
						
		for( let ss = 0; ss < tagSize; ss++ ){
			tagContent += String.fromCharCode(view.getInt8(ss + startPoint + 4 + 2));
		}
		const regEx = /[^\w- !@|.,#&]/ig
		tagContent = tagContent.replace(regEx, '');
		return tagContent;
	} // end method getTextTagData

	getImageTagData( startPoint ){
		let tagSize = '';
		/*let data = '';
		let textEncoding = '';
		let picType = "";
		let desc = "";
		let k = '';
		let mimeType = '';
		let imgURL;*/
		let JF = '';
		let zero = false;
		//let zeroCount = 0;
		let r = /-/;
		const JFI = '747073'; // JFIF = '74707370';
		const Exi = '69120105'; // Exif = '69120105102';
		const PNG = '807871';
		const view = new DataView(this.AudioFile.TagData.buffer);
		let fileNum = this.currentFileNumber;
		const file = this.AudioFile;
		//const fname = file.ID[ fileNum ]; 
		
		for( let s = 0; s < 4; s++ ){
			let t = view.getInt8( startPoint + s );
			let tt = t + '';
			t = tt.replace(r, '');
			t = this.base( t, 16, 10);
			//alert( t );
			t = this.padZero( this.base( t, 2, 16 ) );
			tagSize += t;
		} // end for
		
		tagSize = this.base( tagSize, 10, 2);
		startPoint += 6;	
		let imgArrayBuffer;
		let loopCount = tagSize;
				
		for( let i = startPoint, j = 0; i < loopCount; i++, j++ ){
			if( j == 0){
				textEncoding += view.getInt8( i );
			} else if ( j > 0 && j < 12 ) {
				const mime = view.getInt8( i );
				if( mime == 0 );
				else {
					mimeType += String.fromCharCode( mime );
				}
			}
			
			if( j == 12 ){
				picType = view.getInt8( i );
			}
			
			if( !zero ){
				const imgMark = view.getInt8( i );
				if( imgMark == 74 || imgMark == 69 || imgMark == 80 ){
					JF = view.getInt8( i ) + '' + view.getInt8( i + 1 ) + view.getInt8( i + 2 );
					if( JF == PNG ){
						zero = true;
						i -= 1;
						loopCount = i;
						//console.log( i );

					} else if( JF == JFI ) {
						JF = view.getInt8( i ) + '' + view.getInt8( i + 1 ) + view.getInt8( i + 2 ) + view.getInt8( i + 3 );
						if( JF == (JFI + '70')) {
							zero = true;
							i -= 6;
							loopCount = i;
							//console.log( i );
						}
					} else if( JF == Exi ) {
						JF = view.getInt8( i ) + '' + view.getInt8( i + 1 ) + view.getInt8( i + 2 ) + view.getInt8( i + 3 );
						if( JF == (Exi + '102') ) {
							zero = true;
							i -= 6;
							loopCount = i;
							//console.log( i );
						}
					}
				}
			}
			if( zero ) {
				//console.log( i );
				imgArrayBuffer = this.AudioFile.TagData.slice( i, tagSize + 1 );
				/*const imgBlob = new Blob( [ imgArrayBuffer ], {type: 'image/jpeg' } );
				console.log( imgArrayBuffer );
				console.log(imgBlob);
				
				if( imgBlob ) {
					file.ImageData[ fname ] = imgBlob;
					imgURL = window.URL.createObjectURL( imgBlob );
				} else {
					file.ImageData[ fname ] = '';
					imgURL = '';
				}*/
			}
		} // end for
		
		/*this.currentTagSize = parseInt( tagSize, 10 );
		let tagContent = '';
		console.log( imgURL );*/
		const imgData = imgArrayBuffer;
		
		return imgData;//return imgURL;//return imageData;
	} // end getImageData

	// process audio media read as text	
	processTag(){
		let tags = this.AudioFile.TagData;
		let id3 = this.AudioFile.ID3Tag;
		
		const view = new DataView( tags.buffer );
		const version = parseInt(id3.Version, 10);
		
		let byt4 = '';
		let n = 0;
		if( version == 3 || version == 4){
			for ( let jj = 0; jj < view.byteLength; jj++ ) {
				byt4 = view.getInt8( jj );
				if( byt4 == 84 ){
					n = view.getInt8( jj ) + '' + view.getInt8( jj+1 ) + view.getInt8( jj+2 ) + view.getInt8( jj+3 );
					switch( n ){	
						case TAG[ 'TIT2' ]:
						// Title
						id3.Title = this.getTagData( jj, view );
						jj += this.currentTagSize;
						break;
						
						case TAG[ 'TPE1' ]:
						// Artist
						id3.Author = this.getTagData( jj, view );
						jj += this.currentTagSize;
						break;
						
						case TAG[ 'TPE2' ]:
						// Artist 2
						id3.Author2 = this.getTagData( jj, view );
						jj += this.currentTagSize;
						break;
						
						case TAG[ 'TALB' ]:
						// Album
						id3.Album = this.getTagData( jj, view );
						jj += this.currentTagSize;
						break;
						
						case TAG[ 'TYER' ]:
						// Year
						id3.Year = this.getTagData( jj, view );
						jj += this.currentTagSize;
						break;
						
						case TAG[ 'TCON' ]:
						// Genre
						id3.Genre = this.getTagData( jj, view );
						jj += this.currentTagSize;
						break;
					} // end switch
				} // end if
			} // end for
		} // end if
		
		// Process Image Tag
		if( version == 3 || version == 4){
			for ( let mm = 0; mm < view.byteLength; mm++ ){
				const byt4 = view.getInt8( mm );
				if( byt4 == 65 ){
					let n = view.getInt8( mm ) + '' + view.getInt8( mm+1 ) + view.getInt8( mm+2 ) + view.getInt8( mm+3 );
					if( n == TAG[ 'APIC' ] ) {
						id3.CoverArt = this.getImageTagData( mm );
						// mm += this.currentTagSize;
					}
				}
			}
		}
	} // end method processText

	// check if a data exist and return true else return false
	/*testData(data){
		if(data) return true;
		else return false;
	}*/ // end method testData

} // end class AudioReader

const TAG = {
	'APIC' : '65807367', // Cover Art
	'TALB' : '84657666', // Album
	'TIT2' : '84738450', // Title
	'TPE1' : '84806949', // Artist
	'TPE2' : '84806950', // Artist2
	'TYER' : '84896982', // year
	'TCON' : '84677978' // Genre
}
