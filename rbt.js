var RBT = function() {
	var R = {};

	var BLACK = 1, RED = 2;

	var rotate = function(T, x, l, r) {
		y = x[r];
		x[r] = y[l];
		if (!y[l].nil)
			y[l].p = x;
		y.p = x.p;
		if (x.p.nil)
			T.root = y;
		else if (x === x.p[l])
			x.p[l] = y;
		else
			x.p[r] = y;
		y[l] = x;
		x.p = y;

		/*	max maintainence */
		y.max = x.max;
		x.max = Math.max(x.key.high, x[l].max, x[r].max);
	};

	var insertFixUpMain = function(T, z, l, r) {
		y = z.p.p[r];
		if (y.color === RED) {
			z.p.color = BLACK;
			y.color = BLACK;
			z.p.p.color = RED;
			z = z.p.p;
		}
		else {
			if (z === z.p[r]) {
				z = z.p;
				rotate(T, z, l, r);
			}
			z.p.color = BLACK;
			z.p.p.color = RED;
			rotate(T, z.p.p, r, l);
		}
		return z;
	};

	var insertFixUp = function(T, z) {
		while (z.p.color === RED)
			if (z.p === z.p.p.left)
				z = insertFixUpMain(T, z, 'left', 'right');
			else
				z = insertFixUpMain(T, z, 'right', 'left');
		T.root.color = BLACK;
	};

	R.insert = function(T, z) {
		y = T.nil;
		x = T.root;
		while (!x.nil) {
			y = x;
			if (z.key.low < x.key.low)
				x = x.left;
			else
				x = x.right;
		}
		z.p = y;
		if (y.nil)
			T.root = z;
		else if (z.key.low < y.key.low)
			y.left = z;
		else
			y.right = z;
		z.left = T.nil;
		z.right = T.nil;

		/*	max maintainence */
		z.max = z.key.high;
		let m = z.p;
		while (!m.nil) {
			m.max = Math.max(m.key.high, m.left.max, m.right.max);
			m = m.p;
		}

		z.color = RED;
		insertFixUp(T, z);
	};

	var transplant = function(T, u, v) {
		if (u.p.nil)
			T.root = v;
		else if (u === u.p.left)
			u.p.left = v;
		else
			u.p.right = v;
		v.p = u.p;
	};

	var deleteFixUpMain = function(T, x, l, r) {
		w = x.p[r];
		if (w.color === RED) {
			w.color = BLACK;
			x.p.color = RED;
			rotate(T, x.p, l, r);
			w = x.p[r];
		}
		if (w[l].color === BLACK && w[r].color === BLACK) {
			w.color = RED;
			x = x.p;
		}
		else {
			if (w[r].color === BLACK) {
				w[l].color = BLACK;
				w.color = RED;
				rotate(T, w, r, l);
				w = x.p[r];
			}
			w.color = x.p.color;
			x.p.color = BLACK;
			w[r].color = BLACK;
			rotate(T, x.p, l, r);
			x = T.root;
		}
		return x;
	};

	var deleteFixUp = function(T, x) {
		while (x !== T.root && x.color === BLACK) {
			if (x === x.p.left)
				x = deleteFixUpMain(T, x, 'left', 'right');
			else
				x = deleteFixUpMain(T, x, 'right', 'left');
		}
		x.color = BLACK;
	};

	R.delete = function(T, z) {
		y = z;
		let x = T.nil;
		let y_org_color = y.color;
		if (z.left.nil) {
			x = z.right;
			transplant(T, z, z.right);
		}
		else if (z.right.nil) {
			x = z.left;
			transplant(T, z, z.left);
		}
		else {
			y = z.right;
			while (!y.left.nil)
				y = y.left;
			y_org_color = y.color;
			x = y.right;
			if (y.p === z)
				x.p = y;
			else {
				transplant(T, y, y.right);
				y.right = z.right;
				y.right.p = y;
			}
			transplant(T, z, y);
			y.left = z.left;
			y.left.p = y;
			y.color = z.color;
		}
		let m = x.p;
		while (!m.nil) {
			m.max = Math.max(m.key.high, m.left.max, m.right.max);
			m = m.p;
		}
		if (y_org_color === BLACK)
			deleteFixUp(T, x);
	};

	R.search = function(T, i) {
		x = T.root;
		while (!x.nil && !(x.key.low <= i.high && i.low <= x.key.high))
			if (!x.left.nil && x.left.max >= i.low)
				x = x.left;
			else 
				x = x.right;
		return x.key;
	};

	R.newTree = function() {
		let T = {
			nil : {nil : 1, max : -Infinity, color:BLACK}
		};
		T.root = T.nil;
		return T;
	}

	R.newNode = function(key) {
		return {
			key : key,
			max : -Infinity
		};
	}

	return R;
}



















