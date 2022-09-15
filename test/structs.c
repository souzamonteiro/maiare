typedef struct {
    int a;
    float b;
    union {
        long c;
        double d;
    }
} e;

struct {
    int f;
    int g;
} h;

struct i {
    int j;
    int k;
};

printf("%d\n", e.a);
printf("%f\n", e.b);
printf("%ld\n", e.c);
printf("%g\n", e.d);
