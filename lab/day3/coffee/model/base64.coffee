App.filter "base64", ->
	(string) ->
		Base64 =
			_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
			encode: (e) ->
				t = ""
				n = undefined
				r = undefined
				i = undefined
				s = undefined
				o = undefined
				u = undefined
				a = undefined
				f = 0
				e = Base64._utf8_encode(e)
				while f < e.length
					n = e.charCodeAt(f++)
					r = e.charCodeAt(f++)
					i = e.charCodeAt(f++)
					s = n >> 2
					o = (n & 3) << 4 | r >> 4
					u = (r & 15) << 2 | i >> 6
					a = i & 63
					if isNaN(r)
						u = a = 64
					else a = 64  if isNaN(i)
					t = t + @_keyStr.charAt(s) + @_keyStr.charAt(o) + @_keyStr.charAt(u) + @_keyStr.charAt(a)
				t

			decode: (e) ->
				t = ""
				n = undefined
				r = undefined
				i = undefined
				s = undefined
				o = undefined
				u = undefined
				a = undefined
				f = 0
				e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "")
				while f < e.length
					s = @_keyStr.indexOf(e.charAt(f++))
					o = @_keyStr.indexOf(e.charAt(f++))
					u = @_keyStr.indexOf(e.charAt(f++))
					a = @_keyStr.indexOf(e.charAt(f++))
					n = s << 2 | o >> 4
					r = (o & 15) << 4 | u >> 2
					i = (u & 3) << 6 | a
					t = t + String.fromCharCode(n)
					t = t + String.fromCharCode(r)  unless u is 64
					t = t + String.fromCharCode(i)  unless a is 64
				t = Base64._utf8_decode(t)
				t

			_utf8_encode: (e) ->
				e = e.replace(/\r\n/g, "\n")
				t = ""
				n = 0

				while n < e.length
					r = e.charCodeAt(n)
					if r < 128
						t += String.fromCharCode(r)
					else if r > 127 and r < 2048
						t += String.fromCharCode(r >> 6 | 192)
						t += String.fromCharCode(r & 63 | 128)
					else
						t += String.fromCharCode(r >> 12 | 224)
						t += String.fromCharCode(r >> 6 & 63 | 128)
						t += String.fromCharCode(r & 63 | 128)
					n++
				t

			_utf8_decode: (e) ->
				t = ""
				n = 0
				r = c1 = c2 = 0
				while n < e.length
					r = e.charCodeAt(n)
					if r < 128
						t += String.fromCharCode(r)
						n++
					else if r > 191 and r < 224
						c2 = e.charCodeAt(n + 1)
						t += String.fromCharCode((r & 31) << 6 | c2 & 63)
						n += 2
					else
						c2 = e.charCodeAt(n + 1)
						c3 = e.charCodeAt(n + 2)
						t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63)
						n += 3
				t
		if string?
			return Base64.decode string
		else
			return string