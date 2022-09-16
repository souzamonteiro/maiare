struct {
    int a;
    float b;
    union x {
        long c;
        double d;
    } y;
} e, f;

typedef int bool;

struct g {
    int h;
    int i;
} j;

typedef struct {
    int k;
    int l;
} n;

n o;

n p = (n *) o;

printf("%d\n", e.a);
printf("%f\n", e.b);
printf("%ld\n", e.c);
printf("%g\n", e.d);
