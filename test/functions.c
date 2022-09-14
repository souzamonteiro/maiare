void hello(void) {
    printf("Hello World!\n");
}

void showMessage(char *msg) {
    printf("%s", msg);
}

float power(float x, int n) {
    float p = 1;
    int i;

    for (i = 1; i <= n; i++) {
        p *= x;
    }

    return p;
}

f(x) = 2 * x + 1;

int main(int argc, char *argv[]) {
    showMessage("Hello World!\n");

    printf("%d\n", power(5));
    printf("%d\n", f(2));

    return 0;
}
