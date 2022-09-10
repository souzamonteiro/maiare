// This file was generated on Sat Sep 10, 2022 12:04 (UTC-03) by REx v5.55 which is Copyright (c) 1979-2022 by Gunther Rademacher <grd@gmx.net>
// REx command line: Java.ebnf -tree -main -backtrack -cpp -ll 2

#include <string.h>
#include <stdlib.h>
#ifdef _WIN32
  #include <fcntl.h>
  #include <io.h>
#endif
#include <vector>
#include <map>
#include <stdio.h>
#include <string>
#include <algorithm>

class Java
{
public:
  class EventHandler;

  Java(const wchar_t *string, EventHandler *t)
  {
    initialize(string, t);
  }

  virtual ~Java()
  {
  }

  class EventHandler
  {
  public:
    virtual ~EventHandler() {}

    virtual void reset(const wchar_t *string) = 0;
    virtual void startNonterminal(const wchar_t *name, int begin) = 0;
    virtual void endNonterminal(const wchar_t *name, int end) = 0;
    virtual void terminal(const wchar_t *name, int begin, int end) = 0;
    virtual void whitespace(int begin, int end) = 0;
  };

  class XmlSerializer : public EventHandler
  {
  public:
    XmlSerializer(bool indent)
    : input(0)
    , delayedTag(0)
    , indent(indent)
    , hasChildElement(false)
    , depth(0)
    {
    }

    void reset(const wchar_t *input)
    {
      fputs("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", stdout);

      this->input = input;
      delayedTag = 0;
      hasChildElement = false;
      depth = 0;
    }

    void startNonterminal(const wchar_t *tag, int b)
    {
      if (delayedTag != 0)
      {
        fputc('<', stdout);
        fputs(Utf8Encoder::encode(delayedTag).c_str(), stdout);
        fputc('>', stdout);
      }
      delayedTag = tag;
      if (indent)
      {
        fputc('\n', stdout);
        for (int i = 0; i < depth; ++i)
        {
          fputs("  ", stdout);
        }
      }
      hasChildElement = false;
      ++depth;
    }

    void endNonterminal(const wchar_t *tag, int e)
    {
      --depth;
      if (delayedTag != 0)
      {
        delayedTag = 0;
        fputc('<', stdout);
        fputs(Utf8Encoder::encode(tag).c_str(), stdout);
        fputs("/>", stdout);
      }
      else
      {
        if (indent)
        {
          if (hasChildElement)
          {
            fputc('\n', stdout);
            for (int i = 0; i < depth; ++i)
            {
              fputs("  ", stdout);
            }
          }
        }
        fputs("</", stdout);
        fputs(Utf8Encoder::encode(tag).c_str(), stdout);
        fputc('>', stdout);
      }
      hasChildElement = true;
    }

    void whitespace(int b, int e)
    {
      characters(b, e);
    }

    void characters(int b, int e)
    {
      if (b < e)
      {
        if (delayedTag != 0)
        {
          fputc('<', stdout);
          fputs(Utf8Encoder::encode(delayedTag).c_str(), stdout);
          fputc('>', stdout);
          delayedTag = 0;
        }
        std::string encoded = Utf8Encoder::encode(input + b, e - b);
        int size = encoded.size();
        for (int i = 0; i < size; ++i)
        {
          char c = encoded[i];
          switch (c)
          {
          case 0: break;
          case L'&': fputs("&amp;", stdout); break;
          case L'<': fputs("&lt;", stdout); break;
          case L'>': fputs("&gt;", stdout); break;
          default: fputc(c, stdout);
          }
        }
      }
    }

    void terminal(const wchar_t *tag, int b, int e)
    {
      if (tag[0] == L'\'') tag = L"TOKEN";
      startNonterminal(tag, b);
      characters(b, e);
      endNonterminal(tag, e);
    }

  private:
    const wchar_t *input;
    const wchar_t *delayedTag;
    bool indent;
    bool hasChildElement;
    int depth;
  };

  class Symbol
  {
  public:
    virtual ~Symbol() {}

    const wchar_t *name;
    int begin;
    int end;

    virtual void send(EventHandler *e) = 0;

  protected:
    Symbol(const wchar_t *name, int begin, int end)
    {
      this->name = name;
      this->begin = begin;
      this->end = end;
    }
  };

  class Terminal : public Symbol
  {
  public:
    Terminal(const wchar_t *name, int begin, int end)
    : Symbol(name, begin, end)
    {}

    void send(EventHandler *e)
    {
      e->terminal(name, begin, end);
    }
  };

  class Nonterminal : public Symbol
  {
  public:
    std::vector<Symbol *> *children;

    Nonterminal(const wchar_t *name, int begin, int end, std::vector<Symbol *> *children)
    : Symbol(name, begin, end)
    {
      this->children = children;
    }

    ~Nonterminal()
    {
      for (std::vector<Symbol *>::iterator child = children->begin(); child != children->end(); ++child)
        delete *child;
      delete children;
    }

    void send(EventHandler *e)
    {
      e->startNonterminal(name, begin);
      int pos = begin;
      for (std::vector<Symbol *>::iterator i = children->begin(); i != children->end(); ++i)
      {
        Symbol *c = *i;
        if (pos < c->begin) e->whitespace(pos, c->begin);
        c->send(e);
        pos = c->end;
      }
      if (pos < end) e->whitespace(pos, end);
      e->endNonterminal(name, end);
    }
  };

  class TopDownTreeBuilder : public EventHandler
  {
  public:
    TopDownTreeBuilder()
    {
      input = 0;
      stack.clear();
      top = -1;
    }

    void reset(const wchar_t *input)
    {
      this->input = input;
      top = -1;
    }

    void startNonterminal(const wchar_t *name, int begin)
    {
      Nonterminal *nonterminal = new Nonterminal(name, begin, begin, new std::vector<Symbol *>());
      if (top++ >= 0) addChild(nonterminal);
      if ((size_t) top >= stack.size())
        stack.resize(stack.size() == 0 ? 64 : stack.size() << 1);
      stack[top] = nonterminal;
    }

    void endNonterminal(const wchar_t *name, int end)
    {
      stack[top]->end = end;
      if (top > 0) --top;
    }

    void terminal(const wchar_t *name, int begin, int end)
    {
      addChild(new Terminal(name, begin, end));
    }

    void whitespace(int begin, int end)
    {
    }

    void serialize(EventHandler *e)
    {
      e->reset(input);
      stack[0]->send(e);
    }

  private:
    void addChild(Symbol *s)
    {
      Nonterminal *current = stack[top];
      current->children->push_back(s);
    }

    const wchar_t *input;
    std::vector<Nonterminal *> stack;
    int top;
  };

  static int main(int argc, char **argv)
  {
    int returnCode = 0;

    if (argc < 2)
    {
      fprintf(stderr, "Usage: %s [-i] INPUT...\n", argv[0]);
      fprintf(stderr, "\n");
      fprintf(stderr, "  parse INPUT, which is either a filename or literal text enclosed in curly braces\n");
      fprintf(stderr, "\n");
      fprintf(stderr, "  Option:\n");
      fprintf(stderr, "    -i     indented parse tree\n");
    }
    else
    {
#ifdef _WIN32
      _setmode(1, O_BINARY);
#endif

      bool indent = false;
      for (int i = 1; i < argc; ++i)
      {
        if (strcmp(argv[i], "-i") == 0)
        {
          indent = true;
          continue;
        }
        try
        {
          XmlSerializer s(indent);
          std::wstring input = read(argv[i]);
          Java parser(input.c_str(), &s);
          try
          {
            parser.parse_Input();
          }
          catch (ParseException &pe)
          {
            fprintf(stderr, "\n");
            fprintf(stderr, "%s\n", Utf8Encoder::encode(parser.getErrorMessage(pe).c_str()).c_str());
            returnCode = 1;
            break;
          }
        }
        catch (FileNotFound &fnf)
        {
          fprintf(stderr, "error: file not found: %s\n", fnf.getFilename().c_str());
          returnCode = 1;
          break;
        }
        catch (MalformedInputException &mie)
        {
          fprintf(stderr, "error: UTF-8 decoding error in %s at offset %d\n",
            argv[i], static_cast<int>(mie.getOffset()));
          returnCode = 1;
          break;
        }
      }
    }
    return returnCode;
  }

  class ParseException
  {
  private:
    int begin, end, offending, expected, state;
    friend class Java;

  protected:
    ParseException(int b, int e, int s, int o, int x)
    : begin(b), end(e), offending(o), expected(x), state(s)
    {
    }

  public:
    const wchar_t *getMessage() const
    {
      return offending < 0
           ? L"lexical analysis failed"
           : L"syntax error";
    }

    int getBegin() const {return begin;}
    int getEnd() const {return end;}
    int getState() const {return state;}
    int getOffending() const {return offending;}
    int getExpected() const {return expected;}
  };

  void initialize(const wchar_t *source, EventHandler *parsingEventHandler)
  {
    eventHandler = parsingEventHandler;
    input = source;
    reset(0, 0, 0);
  }

  const wchar_t *getInput() const
  {
    return input;
  }

  int getTokenOffset() const
  {
    return b0;
  }

  int getTokenEnd() const
  {
    return e0;
  }

  void reset(int l, int b, int e)
  {
            b0 = b; e0 = b;
    l1 = l; b1 = b; e1 = e;
    l2 = 0; b2 = 0; e2 = 0;
    end = e;
    ex = -1;
    memo.clear();
    eventHandler->reset(input);
  }

  void reset()
  {
    reset(0, 0, 0);
  }

  static const wchar_t *getOffendingToken(ParseException e)
  {
    return e.getOffending() < 0 ? 0 : TOKEN[e.getOffending()];
  }

  static void getExpectedTokenSet(const ParseException &e, const wchar_t **set, int size)
  {
    if (e.expected < 0)
    {
      getTokenSet(- e.state, set, size);
    }
    else if (size == 1)
    {
      set[0] = 0;
    }
    else if (size > 1)
    {
      set[0] = TOKEN[e.expected];
      set[1] = 0;
    }
  }

  static std::wstring to_wstring(int i)
  {
    const wchar_t *sign = i < 0 ? L"-" : L"";
    std::wstring a;
    do
    {
      a += L'0' + abs(i % 10);
      i /= 10;
    }
    while (i != 0);
    a += sign;
    std::reverse(a.begin(), a.end());
    return a;
  }

  std::wstring getErrorMessage(const ParseException &e)
  {
    std::wstring message(e.getMessage());
    const wchar_t *found = getOffendingToken(e);
    if (found != 0)
    {
      message += L", found ";
      message += found;
    }
    const wchar_t *expected[64];
    getExpectedTokenSet(e, expected, sizeof expected / sizeof *expected);
    message += L"\nwhile expecting ";
    const wchar_t *delimiter(expected[1] ? L"[" : L"");
    for (const wchar_t **x = expected; *x; ++x)
    {
      message += delimiter;
      message += *x;
      delimiter = L", ";
    }
    message += expected[1] ? L"]\n" : L"\n";
    int size = e.getEnd() - e.getBegin();
    if (size != 0 && found == 0)
    {
      message += L"after successfully scanning ";
      message += to_wstring(size);
      message += L" characters beginning ";
    }
    int line = 1;
    int column = 1;
    for (int i = 0; i < e.getBegin(); ++i)
    {
      if (input[i] == L'\n')
      {
        ++line;
        column = 1;
      }
      else
      {
        ++column;
      }
    }
    message += L"at line ";
    message += to_wstring(line);
    message += L", column ";
    message += to_wstring(column);
    message += L":\n...";
    const wchar_t *w = input + e.getBegin();
    for (int i = 0; i < 64 && *w; ++i)
    {
      message += *w++;
    }
    message += L"...";
    return message;
  }

  void parse_Input()
  {
    eventHandler->startNonterminal(L"Input", e0);
    lookahead1W(90);                // Sub | WhiteSpace | Comment | EOF | ';' | '@' | 'abstract' | 'class' | 'enum' |
                                    // 'final' | 'import' | 'interface' | 'native' | 'package' | 'private' |
                                    // 'protected' | 'public' | 'static' | 'strictfp' | 'synchronized' | 'transient' |
                                    // 'volatile'
    whitespace();
    parse_CompilationUnit();
    if (l1 == 1)                    // Sub
    {
      consume(1);                   // Sub
    }
    lookahead1W(1);                 // WhiteSpace | Comment | EOF
    consume(11);                    // EOF
    eventHandler->endNonterminal(L"Input", e0);
  }

private:

  void parse_QualifiedIdentifier()
  {
    eventHandler->startNonterminal(L"QualifiedIdentifier", e0);
    consume(4);                     // Identifier
    for (;;)
    {
      lookahead1W(115);             // WhiteSpace | Comment | Identifier | '(' | ')' | ',' | '.' | ';' | '<' | '@' |
                                    // 'abstract' | 'boolean' | 'byte' | 'char' | 'class' | 'double' | 'enum' |
                                    // 'final' | 'float' | 'int' | 'interface' | 'long' | 'native' | 'package' |
                                    // 'private' | 'protected' | 'public' | 'short' | 'static' | 'strictfp' |
                                    // 'synchronized' | 'transient' | 'void' | 'volatile' | '{' | '|' | '}'
      if (l1 != 30)                 // '.'
      {
        break;
      }
      consume(30);                  // '.'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consume(4);                   // Identifier
    }
    eventHandler->endNonterminal(L"QualifiedIdentifier", e0);
  }

  void try_QualifiedIdentifier()
  {
    consumeT(4);                    // Identifier
    for (;;)
    {
      lookahead1W(115);             // WhiteSpace | Comment | Identifier | '(' | ')' | ',' | '.' | ';' | '<' | '@' |
                                    // 'abstract' | 'boolean' | 'byte' | 'char' | 'class' | 'double' | 'enum' |
                                    // 'final' | 'float' | 'int' | 'interface' | 'long' | 'native' | 'package' |
                                    // 'private' | 'protected' | 'public' | 'short' | 'static' | 'strictfp' |
                                    // 'synchronized' | 'transient' | 'void' | 'volatile' | '{' | '|' | '}'
      if (l1 != 30)                 // '.'
      {
        break;
      }
      consumeT(30);                 // '.'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consumeT(4);                  // Identifier
    }
  }

  void parse_QualifiedIdentifierList()
  {
    eventHandler->startNonterminal(L"QualifiedIdentifierList", e0);
    parse_QualifiedIdentifier();
    for (;;)
    {
      if (l1 != 26)                 // ','
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_QualifiedIdentifier();
    }
    eventHandler->endNonterminal(L"QualifiedIdentifierList", e0);
  }

  void try_QualifiedIdentifierList()
  {
    try_QualifiedIdentifier();
    for (;;)
    {
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_QualifiedIdentifier();
    }
  }

  void parse_CompilationUnit()
  {
    eventHandler->startNonterminal(L"CompilationUnit", e0);
    switch (l1)
    {
    case 49:                        // '@'
      lookahead2W(25);              // WhiteSpace | Comment | Identifier | 'interface'
      break;
    default:
      lk = l1;
      break;
    }
    if (lk == 561)                  // '@' Identifier
    {
      lk = memoized(0, e0);
      if (lk == 0)
      {
        int b0A = b0; int e0A = e0; int l1A = l1;
        int b1A = b1; int e1A = e1; int l2A = l2;
        int b2A = b2; int e2A = e2;
        try
        {
          if (l1 == 49)             // '@'
          {
            try_Annotations();
          }
          consumeT(83);             // 'package'
          lookahead1W(0);           // WhiteSpace | Comment | Identifier
          try_QualifiedIdentifier();
          consumeT(35);             // ';'
          lk = -1;
        }
        catch (ParseException &)
        {
          lk = -2;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
        b2 = b2A; e2 = e2A; end = e2A; }}
        memoize(0, e0, lk);
      }
    }
    if (lk == -1
     || lk == 83)                   // 'package'
    {
      if (l1 == 49)                 // '@'
      {
        whitespace();
        parse_Annotations();
      }
      consume(83);                  // 'package'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_QualifiedIdentifier();
      consume(35);                  // ';'
    }
    for (;;)
    {
      lookahead1W(89);              // Sub | WhiteSpace | Comment | EOF | ';' | '@' | 'abstract' | 'class' | 'enum' |
                                    // 'final' | 'import' | 'interface' | 'native' | 'private' | 'protected' |
                                    // 'public' | 'static' | 'strictfp' | 'synchronized' | 'transient' | 'volatile'
      if (l1 != 76)                 // 'import'
      {
        break;
      }
      whitespace();
      parse_ImportDeclaration();
    }
    for (;;)
    {
      lookahead1W(88);              // Sub | WhiteSpace | Comment | EOF | ';' | '@' | 'abstract' | 'class' | 'enum' |
                                    // 'final' | 'interface' | 'native' | 'private' | 'protected' | 'public' |
                                    // 'static' | 'strictfp' | 'synchronized' | 'transient' | 'volatile'
      if (l1 == 1                   // Sub
       || l1 == 11)                 // EOF
      {
        break;
      }
      whitespace();
      parse_TypeDeclaration();
    }
    eventHandler->endNonterminal(L"CompilationUnit", e0);
  }

  void parse_ImportDeclaration()
  {
    eventHandler->startNonterminal(L"ImportDeclaration", e0);
    consume(76);                    // 'import'
    lookahead1W(26);                // WhiteSpace | Comment | Identifier | 'static'
    if (l1 == 89)                   // 'static'
    {
      consume(89);                  // 'static'
    }
    lookahead1W(0);                 // WhiteSpace | Comment | Identifier
    consume(4);                     // Identifier
    for (;;)
    {
      lookahead1W(35);              // WhiteSpace | Comment | '.' | ';'
      switch (l1)
      {
      case 30:                      // '.'
        lookahead2W(21);            // WhiteSpace | Comment | Identifier | '*'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk != 542)                // '.' Identifier
      {
        break;
      }
      consume(30);                  // '.'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consume(4);                   // Identifier
    }
    if (l1 == 30)                   // '.'
    {
      consume(30);                  // '.'
      lookahead1W(4);               // WhiteSpace | Comment | '*'
      consume(21);                  // '*'
    }
    lookahead1W(7);                 // WhiteSpace | Comment | ';'
    consume(35);                    // ';'
    eventHandler->endNonterminal(L"ImportDeclaration", e0);
  }

  void parse_TypeDeclaration()
  {
    eventHandler->startNonterminal(L"TypeDeclaration", e0);
    switch (l1)
    {
    case 35:                        // ';'
      consume(35);                  // ';'
      break;
    default:
      parse_ClassOrInterfaceDeclaration();
      break;
    }
    eventHandler->endNonterminal(L"TypeDeclaration", e0);
  }

  void parse_ClassOrInterfaceDeclaration()
  {
    eventHandler->startNonterminal(L"ClassOrInterfaceDeclaration", e0);
    for (;;)
    {
      lookahead1W(86);              // WhiteSpace | Comment | '@' | 'abstract' | 'class' | 'enum' | 'final' |
                                    // 'interface' | 'native' | 'private' | 'protected' | 'public' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'volatile'
      switch (l1)
      {
      case 49:                      // '@'
        lookahead2W(25);            // WhiteSpace | Comment | Identifier | 'interface'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 62                  // 'class'
       || lk == 68                  // 'enum'
       || lk == 79                  // 'interface'
       || lk == 10161)              // '@' 'interface'
      {
        break;
      }
      whitespace();
      parse_Modifier();
    }
    switch (l1)
    {
    case 62:                        // 'class'
    case 68:                        // 'enum'
      whitespace();
      parse_ClassDeclaration();
      break;
    default:
      whitespace();
      parse_InterfaceDeclaration();
      break;
    }
    eventHandler->endNonterminal(L"ClassOrInterfaceDeclaration", e0);
  }

  void try_ClassOrInterfaceDeclaration()
  {
    for (;;)
    {
      lookahead1W(86);              // WhiteSpace | Comment | '@' | 'abstract' | 'class' | 'enum' | 'final' |
                                    // 'interface' | 'native' | 'private' | 'protected' | 'public' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'volatile'
      switch (l1)
      {
      case 49:                      // '@'
        lookahead2W(25);            // WhiteSpace | Comment | Identifier | 'interface'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 62                  // 'class'
       || lk == 68                  // 'enum'
       || lk == 79                  // 'interface'
       || lk == 10161)              // '@' 'interface'
      {
        break;
      }
      try_Modifier();
    }
    switch (l1)
    {
    case 62:                        // 'class'
    case 68:                        // 'enum'
      try_ClassDeclaration();
      break;
    default:
      try_InterfaceDeclaration();
      break;
    }
  }

  void parse_ClassDeclaration()
  {
    eventHandler->startNonterminal(L"ClassDeclaration", e0);
    switch (l1)
    {
    case 62:                        // 'class'
      parse_NormalClassDeclaration();
      break;
    default:
      parse_EnumDeclaration();
      break;
    }
    eventHandler->endNonterminal(L"ClassDeclaration", e0);
  }

  void try_ClassDeclaration()
  {
    switch (l1)
    {
    case 62:                        // 'class'
      try_NormalClassDeclaration();
      break;
    default:
      try_EnumDeclaration();
      break;
    }
  }

  void parse_InterfaceDeclaration()
  {
    eventHandler->startNonterminal(L"InterfaceDeclaration", e0);
    switch (l1)
    {
    case 79:                        // 'interface'
      parse_NormalInterfaceDeclaration();
      break;
    default:
      parse_AnnotationTypeDeclaration();
      break;
    }
    eventHandler->endNonterminal(L"InterfaceDeclaration", e0);
  }

  void try_InterfaceDeclaration()
  {
    switch (l1)
    {
    case 79:                        // 'interface'
      try_NormalInterfaceDeclaration();
      break;
    default:
      try_AnnotationTypeDeclaration();
      break;
    }
  }

  void parse_NormalClassDeclaration()
  {
    eventHandler->startNonterminal(L"NormalClassDeclaration", e0);
    consume(62);                    // 'class'
    lookahead1W(0);                 // WhiteSpace | Comment | Identifier
    consume(4);                     // Identifier
    lookahead1W(67);                // WhiteSpace | Comment | '<' | 'extends' | 'implements' | '{'
    if (l1 == 36)                   // '<'
    {
      whitespace();
      parse_TypeParameters();
    }
    lookahead1W(59);                // WhiteSpace | Comment | 'extends' | 'implements' | '{'
    if (l1 == 69)                   // 'extends'
    {
      consume(69);                  // 'extends'
      lookahead1W(78);              // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
      whitespace();
      parse_Type();
    }
    if (l1 == 75)                   // 'implements'
    {
      consume(75);                  // 'implements'
      lookahead1W(78);              // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
      whitespace();
      parse_TypeList();
    }
    whitespace();
    parse_ClassBody();
    eventHandler->endNonterminal(L"NormalClassDeclaration", e0);
  }

  void try_NormalClassDeclaration()
  {
    consumeT(62);                   // 'class'
    lookahead1W(0);                 // WhiteSpace | Comment | Identifier
    consumeT(4);                    // Identifier
    lookahead1W(67);                // WhiteSpace | Comment | '<' | 'extends' | 'implements' | '{'
    if (l1 == 36)                   // '<'
    {
      try_TypeParameters();
    }
    lookahead1W(59);                // WhiteSpace | Comment | 'extends' | 'implements' | '{'
    if (l1 == 69)                   // 'extends'
    {
      consumeT(69);                 // 'extends'
      lookahead1W(78);              // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
      try_Type();
    }
    if (l1 == 75)                   // 'implements'
    {
      consumeT(75);                 // 'implements'
      lookahead1W(78);              // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
      try_TypeList();
    }
    try_ClassBody();
  }

  void parse_EnumDeclaration()
  {
    eventHandler->startNonterminal(L"EnumDeclaration", e0);
    consume(68);                    // 'enum'
    lookahead1W(0);                 // WhiteSpace | Comment | Identifier
    consume(4);                     // Identifier
    lookahead1W(44);                // WhiteSpace | Comment | 'implements' | '{'
    if (l1 == 75)                   // 'implements'
    {
      consume(75);                  // 'implements'
      lookahead1W(78);              // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
      whitespace();
      parse_TypeList();
    }
    whitespace();
    parse_EnumBody();
    eventHandler->endNonterminal(L"EnumDeclaration", e0);
  }

  void try_EnumDeclaration()
  {
    consumeT(68);                   // 'enum'
    lookahead1W(0);                 // WhiteSpace | Comment | Identifier
    consumeT(4);                    // Identifier
    lookahead1W(44);                // WhiteSpace | Comment | 'implements' | '{'
    if (l1 == 75)                   // 'implements'
    {
      consumeT(75);                 // 'implements'
      lookahead1W(78);              // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
      try_TypeList();
    }
    try_EnumBody();
  }

  void parse_NormalInterfaceDeclaration()
  {
    eventHandler->startNonterminal(L"NormalInterfaceDeclaration", e0);
    consume(79);                    // 'interface'
    lookahead1W(0);                 // WhiteSpace | Comment | Identifier
    consume(4);                     // Identifier
    lookahead1W(57);                // WhiteSpace | Comment | '<' | 'extends' | '{'
    if (l1 == 36)                   // '<'
    {
      whitespace();
      parse_TypeParameters();
    }
    lookahead1W(43);                // WhiteSpace | Comment | 'extends' | '{'
    if (l1 == 69)                   // 'extends'
    {
      consume(69);                  // 'extends'
      lookahead1W(78);              // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
      whitespace();
      parse_TypeList();
    }
    whitespace();
    parse_InterfaceBody();
    eventHandler->endNonterminal(L"NormalInterfaceDeclaration", e0);
  }

  void try_NormalInterfaceDeclaration()
  {
    consumeT(79);                   // 'interface'
    lookahead1W(0);                 // WhiteSpace | Comment | Identifier
    consumeT(4);                    // Identifier
    lookahead1W(57);                // WhiteSpace | Comment | '<' | 'extends' | '{'
    if (l1 == 36)                   // '<'
    {
      try_TypeParameters();
    }
    lookahead1W(43);                // WhiteSpace | Comment | 'extends' | '{'
    if (l1 == 69)                   // 'extends'
    {
      consumeT(69);                 // 'extends'
      lookahead1W(78);              // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
      try_TypeList();
    }
    try_InterfaceBody();
  }

  void parse_AnnotationTypeDeclaration()
  {
    eventHandler->startNonterminal(L"AnnotationTypeDeclaration", e0);
    consume(49);                    // '@'
    lookahead1W(14);                // WhiteSpace | Comment | 'interface'
    consume(79);                    // 'interface'
    lookahead1W(0);                 // WhiteSpace | Comment | Identifier
    consume(4);                     // Identifier
    lookahead1W(19);                // WhiteSpace | Comment | '{'
    whitespace();
    parse_AnnotationTypeBody();
    eventHandler->endNonterminal(L"AnnotationTypeDeclaration", e0);
  }

  void try_AnnotationTypeDeclaration()
  {
    consumeT(49);                   // '@'
    lookahead1W(14);                // WhiteSpace | Comment | 'interface'
    consumeT(79);                   // 'interface'
    lookahead1W(0);                 // WhiteSpace | Comment | Identifier
    consumeT(4);                    // Identifier
    lookahead1W(19);                // WhiteSpace | Comment | '{'
    try_AnnotationTypeBody();
  }

  void parse_Type()
  {
    eventHandler->startNonterminal(L"Type", e0);
    switch (l1)
    {
    case 4:                         // Identifier
      parse_ReferenceType();
      for (;;)
      {
        lookahead1W(111);           // WhiteSpace | Comment | Identifier | '!=' | '%=' | '&&' | '&=' | ')' | '*=' |
                                    // '+=' | ',' | '-=' | '...' | '/=' | ':' | ';' | '<<=' | '=' | '==' | '>' | '>>=' |
                                    // '>>>=' | '?' | '[' | ']' | '^=' | 'implements' | 'instanceof' | '{' | '|=' |
                                    // '||' | '}'
        if (l1 != 50)               // '['
        {
          break;
        }
        consume(50);                // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consume(51);                // ']'
      }
      break;
    default:
      parse_BasicType();
      for (;;)
      {
        lookahead1W(111);           // WhiteSpace | Comment | Identifier | '!=' | '%=' | '&&' | '&=' | ')' | '*=' |
                                    // '+=' | ',' | '-=' | '...' | '/=' | ':' | ';' | '<<=' | '=' | '==' | '>' | '>>=' |
                                    // '>>>=' | '?' | '[' | ']' | '^=' | 'implements' | 'instanceof' | '{' | '|=' |
                                    // '||' | '}'
        if (l1 != 50)               // '['
        {
          break;
        }
        consume(50);                // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consume(51);                // ']'
      }
      break;
    }
    eventHandler->endNonterminal(L"Type", e0);
  }

  void try_Type()
  {
    switch (l1)
    {
    case 4:                         // Identifier
      try_ReferenceType();
      for (;;)
      {
        lookahead1W(111);           // WhiteSpace | Comment | Identifier | '!=' | '%=' | '&&' | '&=' | ')' | '*=' |
                                    // '+=' | ',' | '-=' | '...' | '/=' | ':' | ';' | '<<=' | '=' | '==' | '>' | '>>=' |
                                    // '>>>=' | '?' | '[' | ']' | '^=' | 'implements' | 'instanceof' | '{' | '|=' |
                                    // '||' | '}'
        if (l1 != 50)               // '['
        {
          break;
        }
        consumeT(50);               // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consumeT(51);               // ']'
      }
      break;
    default:
      try_BasicType();
      for (;;)
      {
        lookahead1W(111);           // WhiteSpace | Comment | Identifier | '!=' | '%=' | '&&' | '&=' | ')' | '*=' |
                                    // '+=' | ',' | '-=' | '...' | '/=' | ':' | ';' | '<<=' | '=' | '==' | '>' | '>>=' |
                                    // '>>>=' | '?' | '[' | ']' | '^=' | 'implements' | 'instanceof' | '{' | '|=' |
                                    // '||' | '}'
        if (l1 != 50)               // '['
        {
          break;
        }
        consumeT(50);               // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consumeT(51);               // ']'
      }
      break;
    }
  }

  void parse_BasicType()
  {
    eventHandler->startNonterminal(L"BasicType", e0);
    switch (l1)
    {
    case 58:                        // 'byte'
      consume(58);                  // 'byte'
      break;
    case 88:                        // 'short'
      consume(88);                  // 'short'
      break;
    case 61:                        // 'char'
      consume(61);                  // 'char'
      break;
    case 78:                        // 'int'
      consume(78);                  // 'int'
      break;
    case 80:                        // 'long'
      consume(80);                  // 'long'
      break;
    case 72:                        // 'float'
      consume(72);                  // 'float'
      break;
    case 66:                        // 'double'
      consume(66);                  // 'double'
      break;
    default:
      consume(56);                  // 'boolean'
      break;
    }
    eventHandler->endNonterminal(L"BasicType", e0);
  }

  void try_BasicType()
  {
    switch (l1)
    {
    case 58:                        // 'byte'
      consumeT(58);                 // 'byte'
      break;
    case 88:                        // 'short'
      consumeT(88);                 // 'short'
      break;
    case 61:                        // 'char'
      consumeT(61);                 // 'char'
      break;
    case 78:                        // 'int'
      consumeT(78);                 // 'int'
      break;
    case 80:                        // 'long'
      consumeT(80);                 // 'long'
      break;
    case 72:                        // 'float'
      consumeT(72);                 // 'float'
      break;
    case 66:                        // 'double'
      consumeT(66);                 // 'double'
      break;
    default:
      consumeT(56);                 // 'boolean'
      break;
    }
  }

  void parse_ReferenceType()
  {
    eventHandler->startNonterminal(L"ReferenceType", e0);
    consume(4);                     // Identifier
    lookahead1W(114);               // WhiteSpace | Comment | Identifier | '!=' | '%=' | '&' | '&&' | '&=' | ')' |
                                    // '*=' | '+=' | ',' | '-=' | '.' | '...' | '/=' | ':' | ';' | '<' | '<<=' | '=' |
                                    // '==' | '>' | '>>=' | '>>>=' | '?' | '[' | ']' | '^=' | 'implements' |
                                    // 'instanceof' | '{' | '|=' | '||' | '}'
    if (l1 == 36)                   // '<'
    {
      whitespace();
      parse_TypeArguments();
    }
    for (;;)
    {
      lookahead1W(113);             // WhiteSpace | Comment | Identifier | '!=' | '%=' | '&' | '&&' | '&=' | ')' |
                                    // '*=' | '+=' | ',' | '-=' | '.' | '...' | '/=' | ':' | ';' | '<<=' | '=' | '==' |
                                    // '>' | '>>=' | '>>>=' | '?' | '[' | ']' | '^=' | 'implements' | 'instanceof' |
                                    // '{' | '|=' | '||' | '}'
      if (l1 != 30)                 // '.'
      {
        break;
      }
      consume(30);                  // '.'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consume(4);                   // Identifier
      lookahead1W(114);             // WhiteSpace | Comment | Identifier | '!=' | '%=' | '&' | '&&' | '&=' | ')' |
                                    // '*=' | '+=' | ',' | '-=' | '.' | '...' | '/=' | ':' | ';' | '<' | '<<=' | '=' |
                                    // '==' | '>' | '>>=' | '>>>=' | '?' | '[' | ']' | '^=' | 'implements' |
                                    // 'instanceof' | '{' | '|=' | '||' | '}'
      if (l1 == 36)                 // '<'
      {
        whitespace();
        parse_TypeArguments();
      }
    }
    eventHandler->endNonterminal(L"ReferenceType", e0);
  }

  void try_ReferenceType()
  {
    consumeT(4);                    // Identifier
    lookahead1W(114);               // WhiteSpace | Comment | Identifier | '!=' | '%=' | '&' | '&&' | '&=' | ')' |
                                    // '*=' | '+=' | ',' | '-=' | '.' | '...' | '/=' | ':' | ';' | '<' | '<<=' | '=' |
                                    // '==' | '>' | '>>=' | '>>>=' | '?' | '[' | ']' | '^=' | 'implements' |
                                    // 'instanceof' | '{' | '|=' | '||' | '}'
    if (l1 == 36)                   // '<'
    {
      try_TypeArguments();
    }
    for (;;)
    {
      lookahead1W(113);             // WhiteSpace | Comment | Identifier | '!=' | '%=' | '&' | '&&' | '&=' | ')' |
                                    // '*=' | '+=' | ',' | '-=' | '.' | '...' | '/=' | ':' | ';' | '<<=' | '=' | '==' |
                                    // '>' | '>>=' | '>>>=' | '?' | '[' | ']' | '^=' | 'implements' | 'instanceof' |
                                    // '{' | '|=' | '||' | '}'
      if (l1 != 30)                 // '.'
      {
        break;
      }
      consumeT(30);                 // '.'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consumeT(4);                  // Identifier
      lookahead1W(114);             // WhiteSpace | Comment | Identifier | '!=' | '%=' | '&' | '&&' | '&=' | ')' |
                                    // '*=' | '+=' | ',' | '-=' | '.' | '...' | '/=' | ':' | ';' | '<' | '<<=' | '=' |
                                    // '==' | '>' | '>>=' | '>>>=' | '?' | '[' | ']' | '^=' | 'implements' |
                                    // 'instanceof' | '{' | '|=' | '||' | '}'
      if (l1 == 36)                 // '<'
      {
        try_TypeArguments();
      }
    }
  }

  void parse_TypeArguments()
  {
    eventHandler->startNonterminal(L"TypeArguments", e0);
    consume(36);                    // '<'
    lookahead1W(81);                // WhiteSpace | Comment | Identifier | '?' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'short'
    whitespace();
    parse_TypeArgument();
    for (;;)
    {
      if (l1 != 26)                 // ','
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(81);              // WhiteSpace | Comment | Identifier | '?' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'short'
      whitespace();
      parse_TypeArgument();
    }
    consume(42);                    // '>'
    eventHandler->endNonterminal(L"TypeArguments", e0);
  }

  void try_TypeArguments()
  {
    consumeT(36);                   // '<'
    lookahead1W(81);                // WhiteSpace | Comment | Identifier | '?' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'short'
    try_TypeArgument();
    for (;;)
    {
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(81);              // WhiteSpace | Comment | Identifier | '?' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'short'
      try_TypeArgument();
    }
    consumeT(42);                   // '>'
  }

  void parse_TypeArgument()
  {
    eventHandler->startNonterminal(L"TypeArgument", e0);
    switch (l1)
    {
    case 48:                        // '?'
      consume(48);                  // '?'
      lookahead1W(65);              // WhiteSpace | Comment | ',' | '>' | 'extends' | 'super'
      if (l1 == 69                  // 'extends'
       || l1 == 91)                 // 'super'
      {
        switch (l1)
        {
        case 69:                    // 'extends'
          consume(69);              // 'extends'
          break;
        default:
          consume(91);              // 'super'
          break;
        }
        lookahead1W(78);            // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
        whitespace();
        parse_Type();
      }
      break;
    default:
      parse_Type();
      break;
    }
    eventHandler->endNonterminal(L"TypeArgument", e0);
  }

  void try_TypeArgument()
  {
    switch (l1)
    {
    case 48:                        // '?'
      consumeT(48);                 // '?'
      lookahead1W(65);              // WhiteSpace | Comment | ',' | '>' | 'extends' | 'super'
      if (l1 == 69                  // 'extends'
       || l1 == 91)                 // 'super'
      {
        switch (l1)
        {
        case 69:                    // 'extends'
          consumeT(69);             // 'extends'
          break;
        default:
          consumeT(91);             // 'super'
          break;
        }
        lookahead1W(78);            // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
        try_Type();
      }
      break;
    default:
      try_Type();
      break;
    }
  }

  void parse_NonWildcardTypeArguments()
  {
    eventHandler->startNonterminal(L"NonWildcardTypeArguments", e0);
    consume(36);                    // '<'
    lookahead1W(78);                // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
    whitespace();
    parse_TypeList();
    consume(42);                    // '>'
    eventHandler->endNonterminal(L"NonWildcardTypeArguments", e0);
  }

  void try_NonWildcardTypeArguments()
  {
    consumeT(36);                   // '<'
    lookahead1W(78);                // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
    try_TypeList();
    consumeT(42);                   // '>'
  }

  void parse_TypeList()
  {
    eventHandler->startNonterminal(L"TypeList", e0);
    parse_Type();
    for (;;)
    {
      if (l1 != 26)                 // ','
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(78);              // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
      whitespace();
      parse_Type();
    }
    eventHandler->endNonterminal(L"TypeList", e0);
  }

  void try_TypeList()
  {
    try_Type();
    for (;;)
    {
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(78);              // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
      try_Type();
    }
  }

  void parse_TypeArgumentsOrDiamond()
  {
    eventHandler->startNonterminal(L"TypeArgumentsOrDiamond", e0);
    switch (l1)
    {
    case 36:                        // '<'
      lookahead2W(83);              // WhiteSpace | Comment | Identifier | '>' | '?' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'short'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 5412:                      // '<' '>'
      consume(36);                  // '<'
      lookahead1W(10);              // WhiteSpace | Comment | '>'
      consume(42);                  // '>'
      break;
    default:
      parse_TypeArguments();
      break;
    }
    eventHandler->endNonterminal(L"TypeArgumentsOrDiamond", e0);
  }

  void try_TypeArgumentsOrDiamond()
  {
    switch (l1)
    {
    case 36:                        // '<'
      lookahead2W(83);              // WhiteSpace | Comment | Identifier | '>' | '?' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'short'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 5412:                      // '<' '>'
      consumeT(36);                 // '<'
      lookahead1W(10);              // WhiteSpace | Comment | '>'
      consumeT(42);                 // '>'
      break;
    default:
      try_TypeArguments();
      break;
    }
  }

  void parse_NonWildcardTypeArgumentsOrDiamond()
  {
    eventHandler->startNonterminal(L"NonWildcardTypeArgumentsOrDiamond", e0);
    switch (l1)
    {
    case 36:                        // '<'
      lookahead2W(80);              // WhiteSpace | Comment | Identifier | '>' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'short'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 5412:                      // '<' '>'
      consume(36);                  // '<'
      lookahead1W(10);              // WhiteSpace | Comment | '>'
      consume(42);                  // '>'
      break;
    default:
      parse_NonWildcardTypeArguments();
      break;
    }
    eventHandler->endNonterminal(L"NonWildcardTypeArgumentsOrDiamond", e0);
  }

  void try_NonWildcardTypeArgumentsOrDiamond()
  {
    switch (l1)
    {
    case 36:                        // '<'
      lookahead2W(80);              // WhiteSpace | Comment | Identifier | '>' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'short'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 5412:                      // '<' '>'
      consumeT(36);                 // '<'
      lookahead1W(10);              // WhiteSpace | Comment | '>'
      consumeT(42);                 // '>'
      break;
    default:
      try_NonWildcardTypeArguments();
      break;
    }
  }

  void parse_TypeParameters()
  {
    eventHandler->startNonterminal(L"TypeParameters", e0);
    consume(36);                    // '<'
    lookahead1W(0);                 // WhiteSpace | Comment | Identifier
    whitespace();
    parse_TypeParameter();
    for (;;)
    {
      if (l1 != 26)                 // ','
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_TypeParameter();
    }
    consume(42);                    // '>'
    eventHandler->endNonterminal(L"TypeParameters", e0);
  }

  void try_TypeParameters()
  {
    consumeT(36);                   // '<'
    lookahead1W(0);                 // WhiteSpace | Comment | Identifier
    try_TypeParameter();
    for (;;)
    {
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_TypeParameter();
    }
    consumeT(42);                   // '>'
  }

  void parse_TypeParameter()
  {
    eventHandler->startNonterminal(L"TypeParameter", e0);
    consume(4);                     // Identifier
    lookahead1W(53);                // WhiteSpace | Comment | ',' | '>' | 'extends'
    if (l1 == 69)                   // 'extends'
    {
      consume(69);                  // 'extends'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_Bound();
    }
    eventHandler->endNonterminal(L"TypeParameter", e0);
  }

  void try_TypeParameter()
  {
    consumeT(4);                    // Identifier
    lookahead1W(53);                // WhiteSpace | Comment | ',' | '>' | 'extends'
    if (l1 == 69)                   // 'extends'
    {
      consumeT(69);                 // 'extends'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_Bound();
    }
  }

  void parse_Bound()
  {
    eventHandler->startNonterminal(L"Bound", e0);
    parse_ReferenceType();
    for (;;)
    {
      if (l1 != 16)                 // '&'
      {
        break;
      }
      consume(16);                  // '&'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_ReferenceType();
    }
    eventHandler->endNonterminal(L"Bound", e0);
  }

  void try_Bound()
  {
    try_ReferenceType();
    for (;;)
    {
      if (l1 != 16)                 // '&'
      {
        break;
      }
      consumeT(16);                 // '&'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_ReferenceType();
    }
  }

  void parse_Modifier()
  {
    eventHandler->startNonterminal(L"Modifier", e0);
    switch (l1)
    {
    case 49:                        // '@'
      parse_Annotation();
      break;
    case 86:                        // 'public'
      consume(86);                  // 'public'
      break;
    case 85:                        // 'protected'
      consume(85);                  // 'protected'
      break;
    case 84:                        // 'private'
      consume(84);                  // 'private'
      break;
    case 89:                        // 'static'
      consume(89);                  // 'static'
      break;
    case 54:                        // 'abstract'
      consume(54);                  // 'abstract'
      break;
    case 70:                        // 'final'
      consume(70);                  // 'final'
      break;
    case 81:                        // 'native'
      consume(81);                  // 'native'
      break;
    case 93:                        // 'synchronized'
      consume(93);                  // 'synchronized'
      break;
    case 97:                        // 'transient'
      consume(97);                  // 'transient'
      break;
    case 100:                       // 'volatile'
      consume(100);                 // 'volatile'
      break;
    default:
      consume(90);                  // 'strictfp'
      break;
    }
    eventHandler->endNonterminal(L"Modifier", e0);
  }

  void try_Modifier()
  {
    switch (l1)
    {
    case 49:                        // '@'
      try_Annotation();
      break;
    case 86:                        // 'public'
      consumeT(86);                 // 'public'
      break;
    case 85:                        // 'protected'
      consumeT(85);                 // 'protected'
      break;
    case 84:                        // 'private'
      consumeT(84);                 // 'private'
      break;
    case 89:                        // 'static'
      consumeT(89);                 // 'static'
      break;
    case 54:                        // 'abstract'
      consumeT(54);                 // 'abstract'
      break;
    case 70:                        // 'final'
      consumeT(70);                 // 'final'
      break;
    case 81:                        // 'native'
      consumeT(81);                 // 'native'
      break;
    case 93:                        // 'synchronized'
      consumeT(93);                 // 'synchronized'
      break;
    case 97:                        // 'transient'
      consumeT(97);                 // 'transient'
      break;
    case 100:                       // 'volatile'
      consumeT(100);                // 'volatile'
      break;
    default:
      consumeT(90);                 // 'strictfp'
      break;
    }
  }

  void parse_Annotations()
  {
    eventHandler->startNonterminal(L"Annotations", e0);
    for (;;)
    {
      whitespace();
      parse_Annotation();
      lookahead1W(48);              // WhiteSpace | Comment | Identifier | '@' | 'package'
      if (l1 != 49)                 // '@'
      {
        break;
      }
    }
    eventHandler->endNonterminal(L"Annotations", e0);
  }

  void try_Annotations()
  {
    for (;;)
    {
      try_Annotation();
      lookahead1W(48);              // WhiteSpace | Comment | Identifier | '@' | 'package'
      if (l1 != 49)                 // '@'
      {
        break;
      }
    }
  }

  void parse_Annotation()
  {
    eventHandler->startNonterminal(L"Annotation", e0);
    consume(49);                    // '@'
    lookahead1W(0);                 // WhiteSpace | Comment | Identifier
    whitespace();
    parse_QualifiedIdentifier();
    if (l1 == 19)                   // '('
    {
      consume(19);                  // '('
      lookahead1W(107);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // ')' | '+' | '++' | '-' | '--' | '<' | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' |
                                    // 'void' | '{' | '~'
      if (l1 != 20)                 // ')'
      {
        whitespace();
        parse_AnnotationElement();
      }
      lookahead1W(3);               // WhiteSpace | Comment | ')'
      consume(20);                  // ')'
    }
    eventHandler->endNonterminal(L"Annotation", e0);
  }

  void try_Annotation()
  {
    consumeT(49);                   // '@'
    lookahead1W(0);                 // WhiteSpace | Comment | Identifier
    try_QualifiedIdentifier();
    if (l1 == 19)                   // '('
    {
      consumeT(19);                 // '('
      lookahead1W(107);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // ')' | '+' | '++' | '-' | '--' | '<' | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' |
                                    // 'void' | '{' | '~'
      if (l1 != 20)                 // ')'
      {
        try_AnnotationElement();
      }
      lookahead1W(3);               // WhiteSpace | Comment | ')'
      consumeT(20);                 // ')'
    }
  }

  void parse_AnnotationElement()
  {
    eventHandler->startNonterminal(L"AnnotationElement", e0);
    switch (l1)
    {
    case 4:                         // Identifier
      lookahead2W(102);             // WhiteSpace | Comment | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | '++' |
                                    // '-' | '--' | '.' | '/' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>>' | '?' | '[' | '^' | 'instanceof' | '|' | '||'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 5124:                      // Identifier '='
      parse_ElementValuePairs();
      break;
    default:
      parse_ElementValue();
      break;
    }
    eventHandler->endNonterminal(L"AnnotationElement", e0);
  }

  void try_AnnotationElement()
  {
    switch (l1)
    {
    case 4:                         // Identifier
      lookahead2W(102);             // WhiteSpace | Comment | '!=' | '%' | '&' | '&&' | '(' | ')' | '*' | '+' | '++' |
                                    // '-' | '--' | '.' | '/' | '<' | '<<' | '<=' | '=' | '==' | '>' | '>=' | '>>' |
                                    // '>>>' | '?' | '[' | '^' | 'instanceof' | '|' | '||'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 5124:                      // Identifier '='
      try_ElementValuePairs();
      break;
    default:
      try_ElementValue();
      break;
    }
  }

  void parse_ElementValuePairs()
  {
    eventHandler->startNonterminal(L"ElementValuePairs", e0);
    parse_ElementValuePair();
    for (;;)
    {
      lookahead1W(31);              // WhiteSpace | Comment | ')' | ','
      if (l1 != 26)                 // ','
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_ElementValuePair();
    }
    eventHandler->endNonterminal(L"ElementValuePairs", e0);
  }

  void try_ElementValuePairs()
  {
    try_ElementValuePair();
    for (;;)
    {
      lookahead1W(31);              // WhiteSpace | Comment | ')' | ','
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_ElementValuePair();
    }
  }

  void parse_ElementValuePair()
  {
    eventHandler->startNonterminal(L"ElementValuePair", e0);
    consume(4);                     // Identifier
    lookahead1W(9);                 // WhiteSpace | Comment | '='
    consume(40);                    // '='
    lookahead1W(104);               // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | '@' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '~'
    whitespace();
    parse_ElementValue();
    eventHandler->endNonterminal(L"ElementValuePair", e0);
  }

  void try_ElementValuePair()
  {
    consumeT(4);                    // Identifier
    lookahead1W(9);                 // WhiteSpace | Comment | '='
    consumeT(40);                   // '='
    lookahead1W(104);               // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | '@' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '~'
    try_ElementValue();
  }

  void parse_ElementValue()
  {
    eventHandler->startNonterminal(L"ElementValue", e0);
    switch (l1)
    {
    case 49:                        // '@'
      parse_Annotation();
      break;
    case 102:                       // '{'
      parse_ElementValueArrayInitializer();
      break;
    default:
      parse_Expression1();
      break;
    }
    eventHandler->endNonterminal(L"ElementValue", e0);
  }

  void try_ElementValue()
  {
    switch (l1)
    {
    case 49:                        // '@'
      try_Annotation();
      break;
    case 102:                       // '{'
      try_ElementValueArrayInitializer();
      break;
    default:
      try_Expression1();
      break;
    }
  }

  void parse_ElementValueArrayInitializer()
  {
    eventHandler->startNonterminal(L"ElementValueArrayInitializer", e0);
    consume(102);                   // '{'
    lookahead1W(112);               // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | ',' | '-' | '--' | '<' | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' |
                                    // 'void' | '{' | '}' | '~'
    if (l1 != 26                    // ','
     && l1 != 106)                  // '}'
    {
      whitespace();
      parse_ElementValues();
    }
    if (l1 == 26)                   // ','
    {
      consume(26);                  // ','
    }
    lookahead1W(20);                // WhiteSpace | Comment | '}'
    consume(106);                   // '}'
    eventHandler->endNonterminal(L"ElementValueArrayInitializer", e0);
  }

  void try_ElementValueArrayInitializer()
  {
    consumeT(102);                  // '{'
    lookahead1W(112);               // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | ',' | '-' | '--' | '<' | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' |
                                    // 'void' | '{' | '}' | '~'
    if (l1 != 26                    // ','
     && l1 != 106)                  // '}'
    {
      try_ElementValues();
    }
    if (l1 == 26)                   // ','
    {
      consumeT(26);                 // ','
    }
    lookahead1W(20);                // WhiteSpace | Comment | '}'
    consumeT(106);                  // '}'
  }

  void parse_ElementValues()
  {
    eventHandler->startNonterminal(L"ElementValues", e0);
    parse_ElementValue();
    for (;;)
    {
      lookahead1W(34);              // WhiteSpace | Comment | ',' | '}'
      switch (l1)
      {
      case 26:                      // ','
        lookahead2W(110);           // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | '@' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '}' | '~'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 106                 // '}'
       || lk == 13594)              // ',' '}'
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(104);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | '@' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '~'
      whitespace();
      parse_ElementValue();
    }
    eventHandler->endNonterminal(L"ElementValues", e0);
  }

  void try_ElementValues()
  {
    try_ElementValue();
    for (;;)
    {
      lookahead1W(34);              // WhiteSpace | Comment | ',' | '}'
      switch (l1)
      {
      case 26:                      // ','
        lookahead2W(110);           // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | '@' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '}' | '~'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 106                 // '}'
       || lk == 13594)              // ',' '}'
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(104);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | '@' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '~'
      try_ElementValue();
    }
  }

  void parse_ClassBody()
  {
    eventHandler->startNonterminal(L"ClassBody", e0);
    consume(102);                   // '{'
    for (;;)
    {
      lookahead1W(106);             // WhiteSpace | Comment | Identifier | ';' | '<' | '@' | 'abstract' | 'boolean' |
                                    // 'byte' | 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' |
                                    // 'interface' | 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' |
                                    // 'static' | 'strictfp' | 'synchronized' | 'transient' | 'void' | 'volatile' |
                                    // '{' | '}'
      if (l1 == 106)                // '}'
      {
        break;
      }
      whitespace();
      parse_ClassBodyDeclaration();
    }
    consume(106);                   // '}'
    eventHandler->endNonterminal(L"ClassBody", e0);
  }

  void try_ClassBody()
  {
    consumeT(102);                  // '{'
    for (;;)
    {
      lookahead1W(106);             // WhiteSpace | Comment | Identifier | ';' | '<' | '@' | 'abstract' | 'boolean' |
                                    // 'byte' | 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' |
                                    // 'interface' | 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' |
                                    // 'static' | 'strictfp' | 'synchronized' | 'transient' | 'void' | 'volatile' |
                                    // '{' | '}'
      if (l1 == 106)                // '}'
      {
        break;
      }
      try_ClassBodyDeclaration();
    }
    consumeT(106);                  // '}'
  }

  void parse_ClassBodyDeclaration()
  {
    eventHandler->startNonterminal(L"ClassBodyDeclaration", e0);
    switch (l1)
    {
    case 89:                        // 'static'
      lookahead2W(96);              // WhiteSpace | Comment | Identifier | '<' | '@' | 'abstract' | 'boolean' | 'byte' |
                                    // 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'void' | 'volatile' | '{'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 35:                        // ';'
      consume(35);                  // ';'
      break;
    case 102:                       // '{'
    case 13145:                     // 'static' '{'
      if (l1 == 89)                 // 'static'
      {
        consume(89);                // 'static'
      }
      lookahead1W(19);              // WhiteSpace | Comment | '{'
      whitespace();
      parse_Block();
      break;
    default:
      for (;;)
      {
        lookahead1W(94);            // WhiteSpace | Comment | Identifier | '<' | '@' | 'abstract' | 'boolean' | 'byte' |
                                    // 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'void' | 'volatile'
        switch (l1)
        {
        case 49:                    // '@'
          lookahead2W(25);          // WhiteSpace | Comment | Identifier | 'interface'
          break;
        default:
          lk = l1;
          break;
        }
        if (lk != 54                // 'abstract'
         && lk != 70                // 'final'
         && lk != 81                // 'native'
         && lk != 84                // 'private'
         && lk != 85                // 'protected'
         && lk != 86                // 'public'
         && lk != 89                // 'static'
         && lk != 90                // 'strictfp'
         && lk != 93                // 'synchronized'
         && lk != 97                // 'transient'
         && lk != 100               // 'volatile'
         && lk != 561)              // '@' Identifier
        {
          break;
        }
        whitespace();
        parse_Modifier();
      }
      whitespace();
      parse_MemberDecl();
      break;
    }
    eventHandler->endNonterminal(L"ClassBodyDeclaration", e0);
  }

  void try_ClassBodyDeclaration()
  {
    switch (l1)
    {
    case 89:                        // 'static'
      lookahead2W(96);              // WhiteSpace | Comment | Identifier | '<' | '@' | 'abstract' | 'boolean' | 'byte' |
                                    // 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'void' | 'volatile' | '{'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 35:                        // ';'
      consumeT(35);                 // ';'
      break;
    case 102:                       // '{'
    case 13145:                     // 'static' '{'
      if (l1 == 89)                 // 'static'
      {
        consumeT(89);               // 'static'
      }
      lookahead1W(19);              // WhiteSpace | Comment | '{'
      try_Block();
      break;
    default:
      for (;;)
      {
        lookahead1W(94);            // WhiteSpace | Comment | Identifier | '<' | '@' | 'abstract' | 'boolean' | 'byte' |
                                    // 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'void' | 'volatile'
        switch (l1)
        {
        case 49:                    // '@'
          lookahead2W(25);          // WhiteSpace | Comment | Identifier | 'interface'
          break;
        default:
          lk = l1;
          break;
        }
        if (lk != 54                // 'abstract'
         && lk != 70                // 'final'
         && lk != 81                // 'native'
         && lk != 84                // 'private'
         && lk != 85                // 'protected'
         && lk != 86                // 'public'
         && lk != 89                // 'static'
         && lk != 90                // 'strictfp'
         && lk != 93                // 'synchronized'
         && lk != 97                // 'transient'
         && lk != 100               // 'volatile'
         && lk != 561)              // '@' Identifier
        {
          break;
        }
        try_Modifier();
      }
      try_MemberDecl();
      break;
    }
  }

  void parse_MemberDecl()
  {
    eventHandler->startNonterminal(L"MemberDecl", e0);
    switch (l1)
    {
    case 4:                         // Identifier
      lookahead2W(69);              // WhiteSpace | Comment | Identifier | '(' | '.' | '<' | '['
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 99:                        // 'void'
      consume(99);                  // 'void'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consume(4);                   // Identifier
      lookahead1W(2);               // WhiteSpace | Comment | '('
      whitespace();
      parse_VoidMethodDeclaratorRest();
      break;
    case 2436:                      // Identifier '('
      consume(4);                   // Identifier
      lookahead1W(2);               // WhiteSpace | Comment | '('
      whitespace();
      parse_ConstructorDeclaratorRest();
      break;
    case 36:                        // '<'
      parse_GenericMethodOrConstructorDecl();
      break;
    case 62:                        // 'class'
    case 68:                        // 'enum'
      parse_ClassDeclaration();
      break;
    case 49:                        // '@'
    case 79:                        // 'interface'
      parse_InterfaceDeclaration();
      break;
    default:
      parse_MethodOrFieldDecl();
      break;
    }
    eventHandler->endNonterminal(L"MemberDecl", e0);
  }

  void try_MemberDecl()
  {
    switch (l1)
    {
    case 4:                         // Identifier
      lookahead2W(69);              // WhiteSpace | Comment | Identifier | '(' | '.' | '<' | '['
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 99:                        // 'void'
      consumeT(99);                 // 'void'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consumeT(4);                  // Identifier
      lookahead1W(2);               // WhiteSpace | Comment | '('
      try_VoidMethodDeclaratorRest();
      break;
    case 2436:                      // Identifier '('
      consumeT(4);                  // Identifier
      lookahead1W(2);               // WhiteSpace | Comment | '('
      try_ConstructorDeclaratorRest();
      break;
    case 36:                        // '<'
      try_GenericMethodOrConstructorDecl();
      break;
    case 62:                        // 'class'
    case 68:                        // 'enum'
      try_ClassDeclaration();
      break;
    case 49:                        // '@'
    case 79:                        // 'interface'
      try_InterfaceDeclaration();
      break;
    default:
      try_MethodOrFieldDecl();
      break;
    }
  }

  void parse_MethodOrFieldDecl()
  {
    eventHandler->startNonterminal(L"MethodOrFieldDecl", e0);
    parse_Type();
    consume(4);                     // Identifier
    lookahead1W(72);                // WhiteSpace | Comment | '(' | ',' | ';' | '=' | '['
    whitespace();
    parse_MethodOrFieldRest();
    eventHandler->endNonterminal(L"MethodOrFieldDecl", e0);
  }

  void try_MethodOrFieldDecl()
  {
    try_Type();
    consumeT(4);                    // Identifier
    lookahead1W(72);                // WhiteSpace | Comment | '(' | ',' | ';' | '=' | '['
    try_MethodOrFieldRest();
  }

  void parse_MethodOrFieldRest()
  {
    eventHandler->startNonterminal(L"MethodOrFieldRest", e0);
    switch (l1)
    {
    case 19:                        // '('
      parse_MethodDeclaratorRest();
      break;
    default:
      parse_FieldDeclaratorsRest();
      consume(35);                  // ';'
      break;
    }
    eventHandler->endNonterminal(L"MethodOrFieldRest", e0);
  }

  void try_MethodOrFieldRest()
  {
    switch (l1)
    {
    case 19:                        // '('
      try_MethodDeclaratorRest();
      break;
    default:
      try_FieldDeclaratorsRest();
      consumeT(35);                 // ';'
      break;
    }
  }

  void parse_FieldDeclaratorsRest()
  {
    eventHandler->startNonterminal(L"FieldDeclaratorsRest", e0);
    parse_VariableDeclaratorRest();
    for (;;)
    {
      lookahead1W(33);              // WhiteSpace | Comment | ',' | ';'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_VariableDeclarator();
    }
    eventHandler->endNonterminal(L"FieldDeclaratorsRest", e0);
  }

  void try_FieldDeclaratorsRest()
  {
    try_VariableDeclaratorRest();
    for (;;)
    {
      lookahead1W(33);              // WhiteSpace | Comment | ',' | ';'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_VariableDeclarator();
    }
  }

  void parse_MethodDeclaratorRest()
  {
    eventHandler->startNonterminal(L"MethodDeclaratorRest", e0);
    parse_FormalParameters();
    for (;;)
    {
      lookahead1W(66);              // WhiteSpace | Comment | ';' | '[' | 'throws' | '{'
      if (l1 != 50)                 // '['
      {
        break;
      }
      consume(50);                  // '['
      lookahead1W(12);              // WhiteSpace | Comment | ']'
      consume(51);                  // ']'
    }
    if (l1 == 96)                   // 'throws'
    {
      consume(96);                  // 'throws'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_QualifiedIdentifierList();
    }
    switch (l1)
    {
    case 102:                       // '{'
      whitespace();
      parse_Block();
      break;
    default:
      consume(35);                  // ';'
      break;
    }
    eventHandler->endNonterminal(L"MethodDeclaratorRest", e0);
  }

  void try_MethodDeclaratorRest()
  {
    try_FormalParameters();
    for (;;)
    {
      lookahead1W(66);              // WhiteSpace | Comment | ';' | '[' | 'throws' | '{'
      if (l1 != 50)                 // '['
      {
        break;
      }
      consumeT(50);                 // '['
      lookahead1W(12);              // WhiteSpace | Comment | ']'
      consumeT(51);                 // ']'
    }
    if (l1 == 96)                   // 'throws'
    {
      consumeT(96);                 // 'throws'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_QualifiedIdentifierList();
    }
    switch (l1)
    {
    case 102:                       // '{'
      try_Block();
      break;
    default:
      consumeT(35);                 // ';'
      break;
    }
  }

  void parse_VoidMethodDeclaratorRest()
  {
    eventHandler->startNonterminal(L"VoidMethodDeclaratorRest", e0);
    parse_FormalParameters();
    lookahead1W(56);                // WhiteSpace | Comment | ';' | 'throws' | '{'
    if (l1 == 96)                   // 'throws'
    {
      consume(96);                  // 'throws'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_QualifiedIdentifierList();
    }
    switch (l1)
    {
    case 102:                       // '{'
      whitespace();
      parse_Block();
      break;
    default:
      consume(35);                  // ';'
      break;
    }
    eventHandler->endNonterminal(L"VoidMethodDeclaratorRest", e0);
  }

  void try_VoidMethodDeclaratorRest()
  {
    try_FormalParameters();
    lookahead1W(56);                // WhiteSpace | Comment | ';' | 'throws' | '{'
    if (l1 == 96)                   // 'throws'
    {
      consumeT(96);                 // 'throws'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_QualifiedIdentifierList();
    }
    switch (l1)
    {
    case 102:                       // '{'
      try_Block();
      break;
    default:
      consumeT(35);                 // ';'
      break;
    }
  }

  void parse_ConstructorDeclaratorRest()
  {
    eventHandler->startNonterminal(L"ConstructorDeclaratorRest", e0);
    parse_FormalParameters();
    lookahead1W(45);                // WhiteSpace | Comment | 'throws' | '{'
    if (l1 == 96)                   // 'throws'
    {
      consume(96);                  // 'throws'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_QualifiedIdentifierList();
    }
    whitespace();
    parse_Block();
    eventHandler->endNonterminal(L"ConstructorDeclaratorRest", e0);
  }

  void try_ConstructorDeclaratorRest()
  {
    try_FormalParameters();
    lookahead1W(45);                // WhiteSpace | Comment | 'throws' | '{'
    if (l1 == 96)                   // 'throws'
    {
      consumeT(96);                 // 'throws'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_QualifiedIdentifierList();
    }
    try_Block();
  }

  void parse_GenericMethodOrConstructorDecl()
  {
    eventHandler->startNonterminal(L"GenericMethodOrConstructorDecl", e0);
    parse_TypeParameters();
    lookahead1W(82);                // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short' | 'void'
    whitespace();
    parse_GenericMethodOrConstructorRest();
    eventHandler->endNonterminal(L"GenericMethodOrConstructorDecl", e0);
  }

  void try_GenericMethodOrConstructorDecl()
  {
    try_TypeParameters();
    lookahead1W(82);                // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short' | 'void'
    try_GenericMethodOrConstructorRest();
  }

  void parse_GenericMethodOrConstructorRest()
  {
    eventHandler->startNonterminal(L"GenericMethodOrConstructorRest", e0);
    switch (l1)
    {
    case 4:                         // Identifier
      lookahead2W(69);              // WhiteSpace | Comment | Identifier | '(' | '.' | '<' | '['
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 2436:                      // Identifier '('
      consume(4);                   // Identifier
      lookahead1W(2);               // WhiteSpace | Comment | '('
      whitespace();
      parse_ConstructorDeclaratorRest();
      break;
    default:
      switch (l1)
      {
      case 99:                      // 'void'
        consume(99);                // 'void'
        break;
      default:
        parse_Type();
        break;
      }
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consume(4);                   // Identifier
      lookahead1W(2);               // WhiteSpace | Comment | '('
      whitespace();
      parse_MethodDeclaratorRest();
      break;
    }
    eventHandler->endNonterminal(L"GenericMethodOrConstructorRest", e0);
  }

  void try_GenericMethodOrConstructorRest()
  {
    switch (l1)
    {
    case 4:                         // Identifier
      lookahead2W(69);              // WhiteSpace | Comment | Identifier | '(' | '.' | '<' | '['
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 2436:                      // Identifier '('
      consumeT(4);                  // Identifier
      lookahead1W(2);               // WhiteSpace | Comment | '('
      try_ConstructorDeclaratorRest();
      break;
    default:
      switch (l1)
      {
      case 99:                      // 'void'
        consumeT(99);               // 'void'
        break;
      default:
        try_Type();
        break;
      }
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consumeT(4);                  // Identifier
      lookahead1W(2);               // WhiteSpace | Comment | '('
      try_MethodDeclaratorRest();
      break;
    }
  }

  void parse_InterfaceBody()
  {
    eventHandler->startNonterminal(L"InterfaceBody", e0);
    consume(102);                   // '{'
    for (;;)
    {
      lookahead1W(101);             // WhiteSpace | Comment | Identifier | ';' | '<' | '@' | 'abstract' | 'boolean' |
                                    // 'byte' | 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' |
                                    // 'interface' | 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' |
                                    // 'static' | 'strictfp' | 'synchronized' | 'transient' | 'void' | 'volatile' | '}'
      if (l1 == 106)                // '}'
      {
        break;
      }
      whitespace();
      parse_InterfaceBodyDeclaration();
    }
    consume(106);                   // '}'
    eventHandler->endNonterminal(L"InterfaceBody", e0);
  }

  void try_InterfaceBody()
  {
    consumeT(102);                  // '{'
    for (;;)
    {
      lookahead1W(101);             // WhiteSpace | Comment | Identifier | ';' | '<' | '@' | 'abstract' | 'boolean' |
                                    // 'byte' | 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' |
                                    // 'interface' | 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' |
                                    // 'static' | 'strictfp' | 'synchronized' | 'transient' | 'void' | 'volatile' | '}'
      if (l1 == 106)                // '}'
      {
        break;
      }
      try_InterfaceBodyDeclaration();
    }
    consumeT(106);                  // '}'
  }

  void parse_InterfaceBodyDeclaration()
  {
    eventHandler->startNonterminal(L"InterfaceBodyDeclaration", e0);
    switch (l1)
    {
    case 35:                        // ';'
      consume(35);                  // ';'
      break;
    default:
      for (;;)
      {
        lookahead1W(94);            // WhiteSpace | Comment | Identifier | '<' | '@' | 'abstract' | 'boolean' | 'byte' |
                                    // 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'void' | 'volatile'
        switch (l1)
        {
        case 49:                    // '@'
          lookahead2W(25);          // WhiteSpace | Comment | Identifier | 'interface'
          break;
        default:
          lk = l1;
          break;
        }
        if (lk != 54                // 'abstract'
         && lk != 70                // 'final'
         && lk != 81                // 'native'
         && lk != 84                // 'private'
         && lk != 85                // 'protected'
         && lk != 86                // 'public'
         && lk != 89                // 'static'
         && lk != 90                // 'strictfp'
         && lk != 93                // 'synchronized'
         && lk != 97                // 'transient'
         && lk != 100               // 'volatile'
         && lk != 561)              // '@' Identifier
        {
          break;
        }
        whitespace();
        parse_Modifier();
      }
      whitespace();
      parse_InterfaceMemberDecl();
      break;
    }
    eventHandler->endNonterminal(L"InterfaceBodyDeclaration", e0);
  }

  void try_InterfaceBodyDeclaration()
  {
    switch (l1)
    {
    case 35:                        // ';'
      consumeT(35);                 // ';'
      break;
    default:
      for (;;)
      {
        lookahead1W(94);            // WhiteSpace | Comment | Identifier | '<' | '@' | 'abstract' | 'boolean' | 'byte' |
                                    // 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'void' | 'volatile'
        switch (l1)
        {
        case 49:                    // '@'
          lookahead2W(25);          // WhiteSpace | Comment | Identifier | 'interface'
          break;
        default:
          lk = l1;
          break;
        }
        if (lk != 54                // 'abstract'
         && lk != 70                // 'final'
         && lk != 81                // 'native'
         && lk != 84                // 'private'
         && lk != 85                // 'protected'
         && lk != 86                // 'public'
         && lk != 89                // 'static'
         && lk != 90                // 'strictfp'
         && lk != 93                // 'synchronized'
         && lk != 97                // 'transient'
         && lk != 100               // 'volatile'
         && lk != 561)              // '@' Identifier
        {
          break;
        }
        try_Modifier();
      }
      try_InterfaceMemberDecl();
      break;
    }
  }

  void parse_InterfaceMemberDecl()
  {
    eventHandler->startNonterminal(L"InterfaceMemberDecl", e0);
    switch (l1)
    {
    case 99:                        // 'void'
      consume(99);                  // 'void'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consume(4);                   // Identifier
      lookahead1W(2);               // WhiteSpace | Comment | '('
      whitespace();
      parse_VoidInterfaceMethodDeclaratorRest();
      break;
    case 36:                        // '<'
      parse_InterfaceGenericMethodDecl();
      break;
    case 62:                        // 'class'
    case 68:                        // 'enum'
      parse_ClassDeclaration();
      break;
    case 49:                        // '@'
    case 79:                        // 'interface'
      parse_InterfaceDeclaration();
      break;
    default:
      parse_InterfaceMethodOrFieldDecl();
      break;
    }
    eventHandler->endNonterminal(L"InterfaceMemberDecl", e0);
  }

  void try_InterfaceMemberDecl()
  {
    switch (l1)
    {
    case 99:                        // 'void'
      consumeT(99);                 // 'void'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consumeT(4);                  // Identifier
      lookahead1W(2);               // WhiteSpace | Comment | '('
      try_VoidInterfaceMethodDeclaratorRest();
      break;
    case 36:                        // '<'
      try_InterfaceGenericMethodDecl();
      break;
    case 62:                        // 'class'
    case 68:                        // 'enum'
      try_ClassDeclaration();
      break;
    case 49:                        // '@'
    case 79:                        // 'interface'
      try_InterfaceDeclaration();
      break;
    default:
      try_InterfaceMethodOrFieldDecl();
      break;
    }
  }

  void parse_InterfaceMethodOrFieldDecl()
  {
    eventHandler->startNonterminal(L"InterfaceMethodOrFieldDecl", e0);
    parse_Type();
    consume(4);                     // Identifier
    lookahead1W(51);                // WhiteSpace | Comment | '(' | '=' | '['
    whitespace();
    parse_InterfaceMethodOrFieldRest();
    eventHandler->endNonterminal(L"InterfaceMethodOrFieldDecl", e0);
  }

  void try_InterfaceMethodOrFieldDecl()
  {
    try_Type();
    consumeT(4);                    // Identifier
    lookahead1W(51);                // WhiteSpace | Comment | '(' | '=' | '['
    try_InterfaceMethodOrFieldRest();
  }

  void parse_InterfaceMethodOrFieldRest()
  {
    eventHandler->startNonterminal(L"InterfaceMethodOrFieldRest", e0);
    switch (l1)
    {
    case 19:                        // '('
      parse_InterfaceMethodDeclaratorRest();
      break;
    default:
      parse_ConstantDeclaratorsRest();
      consume(35);                  // ';'
      break;
    }
    eventHandler->endNonterminal(L"InterfaceMethodOrFieldRest", e0);
  }

  void try_InterfaceMethodOrFieldRest()
  {
    switch (l1)
    {
    case 19:                        // '('
      try_InterfaceMethodDeclaratorRest();
      break;
    default:
      try_ConstantDeclaratorsRest();
      consumeT(35);                 // ';'
      break;
    }
  }

  void parse_ConstantDeclaratorsRest()
  {
    eventHandler->startNonterminal(L"ConstantDeclaratorsRest", e0);
    parse_ConstantDeclaratorRest();
    for (;;)
    {
      lookahead1W(33);              // WhiteSpace | Comment | ',' | ';'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_ConstantDeclarator();
    }
    eventHandler->endNonterminal(L"ConstantDeclaratorsRest", e0);
  }

  void try_ConstantDeclaratorsRest()
  {
    try_ConstantDeclaratorRest();
    for (;;)
    {
      lookahead1W(33);              // WhiteSpace | Comment | ',' | ';'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_ConstantDeclarator();
    }
  }

  void parse_ConstantDeclaratorRest()
  {
    eventHandler->startNonterminal(L"ConstantDeclaratorRest", e0);
    for (;;)
    {
      lookahead1W(40);              // WhiteSpace | Comment | '=' | '['
      if (l1 != 50)                 // '['
      {
        break;
      }
      consume(50);                  // '['
      lookahead1W(12);              // WhiteSpace | Comment | ']'
      consume(51);                  // ']'
    }
    consume(40);                    // '='
    lookahead1W(100);               // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '~'
    whitespace();
    parse_VariableInitializer();
    eventHandler->endNonterminal(L"ConstantDeclaratorRest", e0);
  }

  void try_ConstantDeclaratorRest()
  {
    for (;;)
    {
      lookahead1W(40);              // WhiteSpace | Comment | '=' | '['
      if (l1 != 50)                 // '['
      {
        break;
      }
      consumeT(50);                 // '['
      lookahead1W(12);              // WhiteSpace | Comment | ']'
      consumeT(51);                 // ']'
    }
    consumeT(40);                   // '='
    lookahead1W(100);               // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '~'
    try_VariableInitializer();
  }

  void parse_ConstantDeclarator()
  {
    eventHandler->startNonterminal(L"ConstantDeclarator", e0);
    consume(4);                     // Identifier
    lookahead1W(40);                // WhiteSpace | Comment | '=' | '['
    whitespace();
    parse_ConstantDeclaratorRest();
    eventHandler->endNonterminal(L"ConstantDeclarator", e0);
  }

  void try_ConstantDeclarator()
  {
    consumeT(4);                    // Identifier
    lookahead1W(40);                // WhiteSpace | Comment | '=' | '['
    try_ConstantDeclaratorRest();
  }

  void parse_InterfaceMethodDeclaratorRest()
  {
    eventHandler->startNonterminal(L"InterfaceMethodDeclaratorRest", e0);
    parse_FormalParameters();
    for (;;)
    {
      lookahead1W(55);              // WhiteSpace | Comment | ';' | '[' | 'throws'
      if (l1 != 50)                 // '['
      {
        break;
      }
      consume(50);                  // '['
      lookahead1W(12);              // WhiteSpace | Comment | ']'
      consume(51);                  // ']'
    }
    if (l1 == 96)                   // 'throws'
    {
      consume(96);                  // 'throws'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_QualifiedIdentifierList();
    }
    consume(35);                    // ';'
    eventHandler->endNonterminal(L"InterfaceMethodDeclaratorRest", e0);
  }

  void try_InterfaceMethodDeclaratorRest()
  {
    try_FormalParameters();
    for (;;)
    {
      lookahead1W(55);              // WhiteSpace | Comment | ';' | '[' | 'throws'
      if (l1 != 50)                 // '['
      {
        break;
      }
      consumeT(50);                 // '['
      lookahead1W(12);              // WhiteSpace | Comment | ']'
      consumeT(51);                 // ']'
    }
    if (l1 == 96)                   // 'throws'
    {
      consumeT(96);                 // 'throws'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_QualifiedIdentifierList();
    }
    consumeT(35);                   // ';'
  }

  void parse_VoidInterfaceMethodDeclaratorRest()
  {
    eventHandler->startNonterminal(L"VoidInterfaceMethodDeclaratorRest", e0);
    parse_FormalParameters();
    lookahead1W(38);                // WhiteSpace | Comment | ';' | 'throws'
    if (l1 == 96)                   // 'throws'
    {
      consume(96);                  // 'throws'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_QualifiedIdentifierList();
    }
    consume(35);                    // ';'
    eventHandler->endNonterminal(L"VoidInterfaceMethodDeclaratorRest", e0);
  }

  void try_VoidInterfaceMethodDeclaratorRest()
  {
    try_FormalParameters();
    lookahead1W(38);                // WhiteSpace | Comment | ';' | 'throws'
    if (l1 == 96)                   // 'throws'
    {
      consumeT(96);                 // 'throws'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_QualifiedIdentifierList();
    }
    consumeT(35);                   // ';'
  }

  void parse_InterfaceGenericMethodDecl()
  {
    eventHandler->startNonterminal(L"InterfaceGenericMethodDecl", e0);
    parse_TypeParameters();
    lookahead1W(82);                // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short' | 'void'
    switch (l1)
    {
    case 99:                        // 'void'
      consume(99);                  // 'void'
      break;
    default:
      whitespace();
      parse_Type();
      break;
    }
    lookahead1W(0);                 // WhiteSpace | Comment | Identifier
    consume(4);                     // Identifier
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    whitespace();
    parse_InterfaceMethodDeclaratorRest();
    eventHandler->endNonterminal(L"InterfaceGenericMethodDecl", e0);
  }

  void try_InterfaceGenericMethodDecl()
  {
    try_TypeParameters();
    lookahead1W(82);                // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short' | 'void'
    switch (l1)
    {
    case 99:                        // 'void'
      consumeT(99);                 // 'void'
      break;
    default:
      try_Type();
      break;
    }
    lookahead1W(0);                 // WhiteSpace | Comment | Identifier
    consumeT(4);                    // Identifier
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    try_InterfaceMethodDeclaratorRest();
  }

  void parse_FormalParameters()
  {
    eventHandler->startNonterminal(L"FormalParameters", e0);
    consume(19);                    // '('
    lookahead1W(85);                // WhiteSpace | Comment | Identifier | ')' | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'final' | 'float' | 'int' | 'long' | 'short'
    if (l1 != 20)                   // ')'
    {
      whitespace();
      parse_FormalParameterDecls();
    }
    consume(20);                    // ')'
    eventHandler->endNonterminal(L"FormalParameters", e0);
  }

  void try_FormalParameters()
  {
    consumeT(19);                   // '('
    lookahead1W(85);                // WhiteSpace | Comment | Identifier | ')' | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'final' | 'float' | 'int' | 'long' | 'short'
    if (l1 != 20)                   // ')'
    {
      try_FormalParameterDecls();
    }
    consumeT(20);                   // ')'
  }

  void parse_FormalParameterDecls()
  {
    eventHandler->startNonterminal(L"FormalParameterDecls", e0);
    for (;;)
    {
      lookahead1W(84);              // WhiteSpace | Comment | Identifier | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'final' | 'float' | 'int' | 'long' | 'short'
      if (l1 != 49                  // '@'
       && l1 != 70)                 // 'final'
      {
        break;
      }
      whitespace();
      parse_VariableModifier();
    }
    whitespace();
    parse_Type();
    whitespace();
    parse_FormalParameterDeclsRest();
    eventHandler->endNonterminal(L"FormalParameterDecls", e0);
  }

  void try_FormalParameterDecls()
  {
    for (;;)
    {
      lookahead1W(84);              // WhiteSpace | Comment | Identifier | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'final' | 'float' | 'int' | 'long' | 'short'
      if (l1 != 49                  // '@'
       && l1 != 70)                 // 'final'
      {
        break;
      }
      try_VariableModifier();
    }
    try_Type();
    try_FormalParameterDeclsRest();
  }

  void parse_VariableModifier()
  {
    eventHandler->startNonterminal(L"VariableModifier", e0);
    switch (l1)
    {
    case 70:                        // 'final'
      consume(70);                  // 'final'
      break;
    default:
      parse_Annotation();
      break;
    }
    eventHandler->endNonterminal(L"VariableModifier", e0);
  }

  void try_VariableModifier()
  {
    switch (l1)
    {
    case 70:                        // 'final'
      consumeT(70);                 // 'final'
      break;
    default:
      try_Annotation();
      break;
    }
  }

  void parse_FormalParameterDeclsRest()
  {
    eventHandler->startNonterminal(L"FormalParameterDeclsRest", e0);
    switch (l1)
    {
    case 4:                         // Identifier
      parse_VariableDeclaratorId();
      if (l1 == 26)                 // ','
      {
        consume(26);                // ','
        lookahead1W(84);            // WhiteSpace | Comment | Identifier | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'final' | 'float' | 'int' | 'long' | 'short'
        whitespace();
        parse_FormalParameterDecls();
      }
      break;
    default:
      consume(31);                  // '...'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_VariableDeclaratorId();
      break;
    }
    eventHandler->endNonterminal(L"FormalParameterDeclsRest", e0);
  }

  void try_FormalParameterDeclsRest()
  {
    switch (l1)
    {
    case 4:                         // Identifier
      try_VariableDeclaratorId();
      if (l1 == 26)                 // ','
      {
        consumeT(26);               // ','
        lookahead1W(84);            // WhiteSpace | Comment | Identifier | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'final' | 'float' | 'int' | 'long' | 'short'
        try_FormalParameterDecls();
      }
      break;
    default:
      consumeT(31);                 // '...'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_VariableDeclaratorId();
      break;
    }
  }

  void parse_VariableDeclaratorId()
  {
    eventHandler->startNonterminal(L"VariableDeclaratorId", e0);
    consume(4);                     // Identifier
    for (;;)
    {
      lookahead1W(76);              // WhiteSpace | Comment | ')' | ',' | ':' | ';' | '=' | '['
      if (l1 != 50)                 // '['
      {
        break;
      }
      consume(50);                  // '['
      lookahead1W(12);              // WhiteSpace | Comment | ']'
      consume(51);                  // ']'
    }
    eventHandler->endNonterminal(L"VariableDeclaratorId", e0);
  }

  void try_VariableDeclaratorId()
  {
    consumeT(4);                    // Identifier
    for (;;)
    {
      lookahead1W(76);              // WhiteSpace | Comment | ')' | ',' | ':' | ';' | '=' | '['
      if (l1 != 50)                 // '['
      {
        break;
      }
      consumeT(50);                 // '['
      lookahead1W(12);              // WhiteSpace | Comment | ']'
      consumeT(51);                 // ']'
    }
  }

  void parse_VariableDeclarators()
  {
    eventHandler->startNonterminal(L"VariableDeclarators", e0);
    parse_VariableDeclarator();
    for (;;)
    {
      lookahead1W(33);              // WhiteSpace | Comment | ',' | ';'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_VariableDeclarator();
    }
    eventHandler->endNonterminal(L"VariableDeclarators", e0);
  }

  void try_VariableDeclarators()
  {
    try_VariableDeclarator();
    for (;;)
    {
      lookahead1W(33);              // WhiteSpace | Comment | ',' | ';'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_VariableDeclarator();
    }
  }

  void parse_VariableDeclarator()
  {
    eventHandler->startNonterminal(L"VariableDeclarator", e0);
    consume(4);                     // Identifier
    lookahead1W(63);                // WhiteSpace | Comment | ',' | ';' | '=' | '['
    whitespace();
    parse_VariableDeclaratorRest();
    eventHandler->endNonterminal(L"VariableDeclarator", e0);
  }

  void try_VariableDeclarator()
  {
    consumeT(4);                    // Identifier
    lookahead1W(63);                // WhiteSpace | Comment | ',' | ';' | '=' | '['
    try_VariableDeclaratorRest();
  }

  void parse_VariableDeclaratorRest()
  {
    eventHandler->startNonterminal(L"VariableDeclaratorRest", e0);
    for (;;)
    {
      lookahead1W(63);              // WhiteSpace | Comment | ',' | ';' | '=' | '['
      if (l1 != 50)                 // '['
      {
        break;
      }
      consume(50);                  // '['
      lookahead1W(12);              // WhiteSpace | Comment | ']'
      consume(51);                  // ']'
    }
    if (l1 == 40)                   // '='
    {
      consume(40);                  // '='
      lookahead1W(100);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '~'
      whitespace();
      parse_VariableInitializer();
    }
    eventHandler->endNonterminal(L"VariableDeclaratorRest", e0);
  }

  void try_VariableDeclaratorRest()
  {
    for (;;)
    {
      lookahead1W(63);              // WhiteSpace | Comment | ',' | ';' | '=' | '['
      if (l1 != 50)                 // '['
      {
        break;
      }
      consumeT(50);                 // '['
      lookahead1W(12);              // WhiteSpace | Comment | ']'
      consumeT(51);                 // ']'
    }
    if (l1 == 40)                   // '='
    {
      consumeT(40);                 // '='
      lookahead1W(100);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '~'
      try_VariableInitializer();
    }
  }

  void parse_VariableInitializer()
  {
    eventHandler->startNonterminal(L"VariableInitializer", e0);
    switch (l1)
    {
    case 102:                       // '{'
      parse_ArrayInitializer();
      break;
    default:
      parse_Expression();
      break;
    }
    eventHandler->endNonterminal(L"VariableInitializer", e0);
  }

  void try_VariableInitializer()
  {
    switch (l1)
    {
    case 102:                       // '{'
      try_ArrayInitializer();
      break;
    default:
      try_Expression();
      break;
    }
  }

  void parse_ArrayInitializer()
  {
    eventHandler->startNonterminal(L"ArrayInitializer", e0);
    consume(102);                   // '{'
    lookahead1W(105);               // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '}' | '~'
    if (l1 != 106)                  // '}'
    {
      whitespace();
      parse_VariableInitializer();
      for (;;)
      {
        lookahead1W(34);            // WhiteSpace | Comment | ',' | '}'
        switch (l1)
        {
        case 26:                    // ','
          lookahead2W(105);         // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '}' | '~'
          break;
        default:
          lk = l1;
          break;
        }
        if (lk == 106               // '}'
         || lk == 13594)            // ',' '}'
        {
          break;
        }
        consume(26);                // ','
        lookahead1W(100);           // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '~'
        whitespace();
        parse_VariableInitializer();
      }
      if (l1 == 26)                 // ','
      {
        consume(26);                // ','
      }
    }
    lookahead1W(20);                // WhiteSpace | Comment | '}'
    consume(106);                   // '}'
    eventHandler->endNonterminal(L"ArrayInitializer", e0);
  }

  void try_ArrayInitializer()
  {
    consumeT(102);                  // '{'
    lookahead1W(105);               // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '}' | '~'
    if (l1 != 106)                  // '}'
    {
      try_VariableInitializer();
      for (;;)
      {
        lookahead1W(34);            // WhiteSpace | Comment | ',' | '}'
        switch (l1)
        {
        case 26:                    // ','
          lookahead2W(105);         // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '}' | '~'
          break;
        default:
          lk = l1;
          break;
        }
        if (lk == 106               // '}'
         || lk == 13594)            // ',' '}'
        {
          break;
        }
        consumeT(26);               // ','
        lookahead1W(100);           // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '~'
        try_VariableInitializer();
      }
      if (l1 == 26)                 // ','
      {
        consumeT(26);               // ','
      }
    }
    lookahead1W(20);                // WhiteSpace | Comment | '}'
    consumeT(106);                  // '}'
  }

  void parse_Block()
  {
    eventHandler->startNonterminal(L"Block", e0);
    consume(102);                   // '{'
    lookahead1W(125);               // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | '@' | 'abstract' | 'assert' | 'boolean' |
                                    // 'break' | 'byte' | 'char' | 'class' | 'continue' | 'do' | 'double' | 'enum' |
                                    // 'final' | 'float' | 'for' | 'if' | 'int' | 'interface' | 'long' | 'native' |
                                    // 'new' | 'private' | 'protected' | 'public' | 'return' | 'short' | 'static' |
                                    // 'strictfp' | 'super' | 'switch' | 'synchronized' | 'this' | 'throw' |
                                    // 'transient' | 'try' | 'void' | 'volatile' | 'while' | '{' | '}' | '~'
    whitespace();
    parse_BlockStatements();
    consume(106);                   // '}'
    eventHandler->endNonterminal(L"Block", e0);
  }

  void try_Block()
  {
    consumeT(102);                  // '{'
    lookahead1W(125);               // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | '@' | 'abstract' | 'assert' | 'boolean' |
                                    // 'break' | 'byte' | 'char' | 'class' | 'continue' | 'do' | 'double' | 'enum' |
                                    // 'final' | 'float' | 'for' | 'if' | 'int' | 'interface' | 'long' | 'native' |
                                    // 'new' | 'private' | 'protected' | 'public' | 'return' | 'short' | 'static' |
                                    // 'strictfp' | 'super' | 'switch' | 'synchronized' | 'this' | 'throw' |
                                    // 'transient' | 'try' | 'void' | 'volatile' | 'while' | '{' | '}' | '~'
    try_BlockStatements();
    consumeT(106);                  // '}'
  }

  void parse_BlockStatements()
  {
    eventHandler->startNonterminal(L"BlockStatements", e0);
    for (;;)
    {
      lookahead1W(126);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | '@' | 'abstract' | 'assert' | 'boolean' |
                                    // 'break' | 'byte' | 'case' | 'char' | 'class' | 'continue' | 'default' | 'do' |
                                    // 'double' | 'enum' | 'final' | 'float' | 'for' | 'if' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'new' | 'private' | 'protected' | 'public' | 'return' |
                                    // 'short' | 'static' | 'strictfp' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'transient' | 'try' | 'void' | 'volatile' | 'while' | '{' | '}' | '~'
      if (l1 == 59                  // 'case'
       || l1 == 64                  // 'default'
       || l1 == 106)                // '}'
      {
        break;
      }
      whitespace();
      parse_BlockStatement();
    }
    eventHandler->endNonterminal(L"BlockStatements", e0);
  }

  void try_BlockStatements()
  {
    for (;;)
    {
      lookahead1W(126);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | '@' | 'abstract' | 'assert' | 'boolean' |
                                    // 'break' | 'byte' | 'case' | 'char' | 'class' | 'continue' | 'default' | 'do' |
                                    // 'double' | 'enum' | 'final' | 'float' | 'for' | 'if' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'new' | 'private' | 'protected' | 'public' | 'return' |
                                    // 'short' | 'static' | 'strictfp' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'transient' | 'try' | 'void' | 'volatile' | 'while' | '{' | '}' | '~'
      if (l1 == 59                  // 'case'
       || l1 == 64                  // 'default'
       || l1 == 106)                // '}'
      {
        break;
      }
      try_BlockStatement();
    }
  }

  void parse_BlockStatement()
  {
    eventHandler->startNonterminal(L"BlockStatement", e0);
    switch (l1)
    {
    case 4:                         // Identifier
      lookahead2W(119);             // WhiteSpace | Comment | Identifier | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' |
                                    // '*' | '*=' | '+' | '++' | '+=' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '>>>' | '>>>=' | '?' | '[' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||'
      break;
    case 49:                        // '@'
      lookahead2W(25);              // WhiteSpace | Comment | Identifier | 'interface'
      break;
    case 70:                        // 'final'
      lookahead2W(92);              // WhiteSpace | Comment | Identifier | '@' | 'abstract' | 'boolean' | 'byte' |
                                    // 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'volatile'
      break;
    case 93:                        // 'synchronized'
      lookahead2W(87);              // WhiteSpace | Comment | '(' | '@' | 'abstract' | 'class' | 'enum' | 'final' |
                                    // 'interface' | 'native' | 'private' | 'protected' | 'public' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'volatile'
      break;
    case 56:                        // 'boolean'
    case 58:                        // 'byte'
    case 61:                        // 'char'
    case 66:                        // 'double'
    case 72:                        // 'float'
    case 78:                        // 'int'
    case 80:                        // 'long'
    case 88:                        // 'short'
      lookahead2W(46);              // WhiteSpace | Comment | Identifier | '.' | '['
      break;
    default:
      lk = l1;
      break;
    }
    if (lk == 561                   // '@' Identifier
     || lk == 3844                  // Identifier '.'
     || lk == 4612                  // Identifier '<'
     || lk == 6342                  // 'final' '@'
     || lk == 6404                  // Identifier '['
     || lk == 6456                  // 'boolean' '['
     || lk == 6458                  // 'byte' '['
     || lk == 6461                  // 'char' '['
     || lk == 6466                  // 'double' '['
     || lk == 6472                  // 'float' '['
     || lk == 6478                  // 'int' '['
     || lk == 6480                  // 'long' '['
     || lk == 6488                  // 'short' '['
     || lk == 9030)                 // 'final' 'final'
    {
      lk = memoized(1, e0);
      if (lk == 0)
      {
        int b0A = b0; int e0A = e0; int l1A = l1;
        int b1A = b1; int e1A = e1; int l2A = l2;
        int b2A = b2; int e2A = e2;
        try
        {
          try_LocalVariableDeclarationStatement();
          lk = -1;
        }
        catch (ParseException &)
        {
          try
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; end = e2A; }}
            try_ClassOrInterfaceDeclaration();
            lk = -2;
          }
          catch (ParseException &)
          {
            lk = -3;
          }
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
        b2 = b2A; e2 = e2A; end = e2A; }}
        memoize(1, e0, lk);
      }
    }
    switch (lk)
    {
    case -1:
    case 516:                       // Identifier Identifier
    case 568:                       // 'boolean' Identifier
    case 570:                       // 'byte' Identifier
    case 573:                       // 'char' Identifier
    case 578:                       // 'double' Identifier
    case 582:                       // 'final' Identifier
    case 584:                       // 'float' Identifier
    case 590:                       // 'int' Identifier
    case 592:                       // 'long' Identifier
    case 600:                       // 'short' Identifier
    case 7238:                      // 'final' 'boolean'
    case 7494:                      // 'final' 'byte'
    case 7878:                      // 'final' 'char'
    case 8518:                      // 'final' 'double'
    case 9286:                      // 'final' 'float'
    case 10054:                     // 'final' 'int'
    case 10310:                     // 'final' 'long'
    case 11334:                     // 'final' 'short'
      parse_LocalVariableDeclarationStatement();
      break;
    case -2:
    case 54:                        // 'abstract'
    case 62:                        // 'class'
    case 68:                        // 'enum'
    case 79:                        // 'interface'
    case 81:                        // 'native'
    case 84:                        // 'private'
    case 85:                        // 'protected'
    case 86:                        // 'public'
    case 89:                        // 'static'
    case 90:                        // 'strictfp'
    case 97:                        // 'transient'
    case 100:                       // 'volatile'
    case 6365:                      // 'synchronized' '@'
    case 6982:                      // 'final' 'abstract'
    case 7005:                      // 'synchronized' 'abstract'
    case 8006:                      // 'final' 'class'
    case 8029:                      // 'synchronized' 'class'
    case 8774:                      // 'final' 'enum'
    case 8797:                      // 'synchronized' 'enum'
    case 9053:                      // 'synchronized' 'final'
    case 10161:                     // '@' 'interface'
    case 10182:                     // 'final' 'interface'
    case 10205:                     // 'synchronized' 'interface'
    case 10438:                     // 'final' 'native'
    case 10461:                     // 'synchronized' 'native'
    case 10822:                     // 'final' 'private'
    case 10845:                     // 'synchronized' 'private'
    case 10950:                     // 'final' 'protected'
    case 10973:                     // 'synchronized' 'protected'
    case 11078:                     // 'final' 'public'
    case 11101:                     // 'synchronized' 'public'
    case 11462:                     // 'final' 'static'
    case 11485:                     // 'synchronized' 'static'
    case 11590:                     // 'final' 'strictfp'
    case 11613:                     // 'synchronized' 'strictfp'
    case 11974:                     // 'final' 'synchronized'
    case 11997:                     // 'synchronized' 'synchronized'
    case 12486:                     // 'final' 'transient'
    case 12509:                     // 'synchronized' 'transient'
    case 12870:                     // 'final' 'volatile'
    case 12893:                     // 'synchronized' 'volatile'
      parse_ClassOrInterfaceDeclaration();
      break;
    default:
      switch (l1)
      {
      case 4:                       // Identifier
        lookahead2W(116);           // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' | ';' | '<' |
                                    // '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' | '>>>=' |
                                    // '?' | '[' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 4356)               // Identifier ':'
      {
        lk = memoized(2, e0);
        if (lk == 0)
        {
          int b0B = b0; int e0B = e0; int l1B = l1;
          int b1B = b1; int e1B = e1; int l2B = l2;
          int b2B = b2; int e2B = e2;
          try
          {
            consumeT(4);            // Identifier
            lookahead1W(6);         // WhiteSpace | Comment | ':'
            consumeT(34);           // ':'
            lk = -1;
          }
          catch (ParseException &)
          {
            lk = -2;
          }
          b0 = b0B; e0 = e0B; l1 = l1B; if (l1 == 0) {end = e0B;} else {
          b1 = b1B; e1 = e1B; l2 = l2B; if (l2 == 0) {end = e1B;} else {
          b2 = b2B; e2 = e2B; end = e2B; }}
          memoize(2, e0, lk);
        }
      }
      if (lk == -1)
      {
        consume(4);                 // Identifier
        lookahead1W(6);             // WhiteSpace | Comment | ':'
        consume(34);                // ':'
      }
      lookahead1W(117);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
      whitespace();
      parse_Statement();
      break;
    }
    eventHandler->endNonterminal(L"BlockStatement", e0);
  }

  void try_BlockStatement()
  {
    switch (l1)
    {
    case 4:                         // Identifier
      lookahead2W(119);             // WhiteSpace | Comment | Identifier | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' |
                                    // '*' | '*=' | '+' | '++' | '+=' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '>>>' | '>>>=' | '?' | '[' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||'
      break;
    case 49:                        // '@'
      lookahead2W(25);              // WhiteSpace | Comment | Identifier | 'interface'
      break;
    case 70:                        // 'final'
      lookahead2W(92);              // WhiteSpace | Comment | Identifier | '@' | 'abstract' | 'boolean' | 'byte' |
                                    // 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'volatile'
      break;
    case 93:                        // 'synchronized'
      lookahead2W(87);              // WhiteSpace | Comment | '(' | '@' | 'abstract' | 'class' | 'enum' | 'final' |
                                    // 'interface' | 'native' | 'private' | 'protected' | 'public' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'volatile'
      break;
    case 56:                        // 'boolean'
    case 58:                        // 'byte'
    case 61:                        // 'char'
    case 66:                        // 'double'
    case 72:                        // 'float'
    case 78:                        // 'int'
    case 80:                        // 'long'
    case 88:                        // 'short'
      lookahead2W(46);              // WhiteSpace | Comment | Identifier | '.' | '['
      break;
    default:
      lk = l1;
      break;
    }
    if (lk == 561                   // '@' Identifier
     || lk == 3844                  // Identifier '.'
     || lk == 4612                  // Identifier '<'
     || lk == 6342                  // 'final' '@'
     || lk == 6404                  // Identifier '['
     || lk == 6456                  // 'boolean' '['
     || lk == 6458                  // 'byte' '['
     || lk == 6461                  // 'char' '['
     || lk == 6466                  // 'double' '['
     || lk == 6472                  // 'float' '['
     || lk == 6478                  // 'int' '['
     || lk == 6480                  // 'long' '['
     || lk == 6488                  // 'short' '['
     || lk == 9030)                 // 'final' 'final'
    {
      lk = memoized(1, e0);
      if (lk == 0)
      {
        int b0A = b0; int e0A = e0; int l1A = l1;
        int b1A = b1; int e1A = e1; int l2A = l2;
        int b2A = b2; int e2A = e2;
        try
        {
          try_LocalVariableDeclarationStatement();
          memoize(1, e0A, -1);
          lk = -4;
        }
        catch (ParseException &)
        {
          try
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; end = e2A; }}
            try_ClassOrInterfaceDeclaration();
            memoize(1, e0A, -2);
            lk = -4;
          }
          catch (ParseException &)
          {
            lk = -3;
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; end = e2A; }}
            memoize(1, e0A, -3);
          }
        }
      }
    }
    switch (lk)
    {
    case -1:
    case 516:                       // Identifier Identifier
    case 568:                       // 'boolean' Identifier
    case 570:                       // 'byte' Identifier
    case 573:                       // 'char' Identifier
    case 578:                       // 'double' Identifier
    case 582:                       // 'final' Identifier
    case 584:                       // 'float' Identifier
    case 590:                       // 'int' Identifier
    case 592:                       // 'long' Identifier
    case 600:                       // 'short' Identifier
    case 7238:                      // 'final' 'boolean'
    case 7494:                      // 'final' 'byte'
    case 7878:                      // 'final' 'char'
    case 8518:                      // 'final' 'double'
    case 9286:                      // 'final' 'float'
    case 10054:                     // 'final' 'int'
    case 10310:                     // 'final' 'long'
    case 11334:                     // 'final' 'short'
      try_LocalVariableDeclarationStatement();
      break;
    case -2:
    case 54:                        // 'abstract'
    case 62:                        // 'class'
    case 68:                        // 'enum'
    case 79:                        // 'interface'
    case 81:                        // 'native'
    case 84:                        // 'private'
    case 85:                        // 'protected'
    case 86:                        // 'public'
    case 89:                        // 'static'
    case 90:                        // 'strictfp'
    case 97:                        // 'transient'
    case 100:                       // 'volatile'
    case 6365:                      // 'synchronized' '@'
    case 6982:                      // 'final' 'abstract'
    case 7005:                      // 'synchronized' 'abstract'
    case 8006:                      // 'final' 'class'
    case 8029:                      // 'synchronized' 'class'
    case 8774:                      // 'final' 'enum'
    case 8797:                      // 'synchronized' 'enum'
    case 9053:                      // 'synchronized' 'final'
    case 10161:                     // '@' 'interface'
    case 10182:                     // 'final' 'interface'
    case 10205:                     // 'synchronized' 'interface'
    case 10438:                     // 'final' 'native'
    case 10461:                     // 'synchronized' 'native'
    case 10822:                     // 'final' 'private'
    case 10845:                     // 'synchronized' 'private'
    case 10950:                     // 'final' 'protected'
    case 10973:                     // 'synchronized' 'protected'
    case 11078:                     // 'final' 'public'
    case 11101:                     // 'synchronized' 'public'
    case 11462:                     // 'final' 'static'
    case 11485:                     // 'synchronized' 'static'
    case 11590:                     // 'final' 'strictfp'
    case 11613:                     // 'synchronized' 'strictfp'
    case 11974:                     // 'final' 'synchronized'
    case 11997:                     // 'synchronized' 'synchronized'
    case 12486:                     // 'final' 'transient'
    case 12509:                     // 'synchronized' 'transient'
    case 12870:                     // 'final' 'volatile'
    case 12893:                     // 'synchronized' 'volatile'
      try_ClassOrInterfaceDeclaration();
      break;
    case -4:
      break;
    default:
      switch (l1)
      {
      case 4:                       // Identifier
        lookahead2W(116);           // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' | ';' | '<' |
                                    // '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' | '>>>=' |
                                    // '?' | '[' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 4356)               // Identifier ':'
      {
        lk = memoized(2, e0);
        if (lk == 0)
        {
          int b0B = b0; int e0B = e0; int l1B = l1;
          int b1B = b1; int e1B = e1; int l2B = l2;
          int b2B = b2; int e2B = e2;
          try
          {
            consumeT(4);            // Identifier
            lookahead1W(6);         // WhiteSpace | Comment | ':'
            consumeT(34);           // ':'
            memoize(2, e0B, -1);
          }
          catch (ParseException &)
          {
            b0 = b0B; e0 = e0B; l1 = l1B; if (l1 == 0) {end = e0B;} else {
            b1 = b1B; e1 = e1B; l2 = l2B; if (l2 == 0) {end = e1B;} else {
            b2 = b2B; e2 = e2B; end = e2B; }}
            memoize(2, e0B, -2);
          }
          lk = -2;
        }
      }
      if (lk == -1)
      {
        consumeT(4);                // Identifier
        lookahead1W(6);             // WhiteSpace | Comment | ':'
        consumeT(34);               // ':'
      }
      lookahead1W(117);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
      try_Statement();
      break;
    }
  }

  void parse_LocalVariableDeclarationStatement()
  {
    eventHandler->startNonterminal(L"LocalVariableDeclarationStatement", e0);
    for (;;)
    {
      lookahead1W(84);              // WhiteSpace | Comment | Identifier | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'final' | 'float' | 'int' | 'long' | 'short'
      if (l1 != 49                  // '@'
       && l1 != 70)                 // 'final'
      {
        break;
      }
      whitespace();
      parse_VariableModifier();
    }
    whitespace();
    parse_Type();
    whitespace();
    parse_VariableDeclarators();
    consume(35);                    // ';'
    eventHandler->endNonterminal(L"LocalVariableDeclarationStatement", e0);
  }

  void try_LocalVariableDeclarationStatement()
  {
    for (;;)
    {
      lookahead1W(84);              // WhiteSpace | Comment | Identifier | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'final' | 'float' | 'int' | 'long' | 'short'
      if (l1 != 49                  // '@'
       && l1 != 70)                 // 'final'
      {
        break;
      }
      try_VariableModifier();
    }
    try_Type();
    try_VariableDeclarators();
    consumeT(35);                   // ';'
  }

  void parse_Statement()
  {
    eventHandler->startNonterminal(L"Statement", e0);
    switch (l1)
    {
    case 4:                         // Identifier
      lookahead2W(116);             // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' | ';' | '<' |
                                    // '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' | '>>>=' |
                                    // '?' | '[' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||'
      break;
    case 98:                        // 'try'
      lookahead2W(30);              // WhiteSpace | Comment | '(' | '{'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 102:                       // '{'
      parse_Block();
      break;
    case 35:                        // ';'
      consume(35);                  // ';'
      break;
    case 4356:                      // Identifier ':'
      consume(4);                   // Identifier
      lookahead1W(6);               // WhiteSpace | Comment | ':'
      consume(34);                  // ':'
      lookahead1W(117);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
      whitespace();
      parse_Statement();
      break;
    case 74:                        // 'if'
      consume(74);                  // 'if'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      whitespace();
      parse_ParExpression();
      lookahead1W(117);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
      whitespace();
      parse_Statement();
      lookahead1W(127);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | '@' | 'abstract' | 'assert' | 'boolean' |
                                    // 'break' | 'byte' | 'case' | 'char' | 'class' | 'continue' | 'default' | 'do' |
                                    // 'double' | 'else' | 'enum' | 'final' | 'float' | 'for' | 'if' | 'int' |
                                    // 'interface' | 'long' | 'native' | 'new' | 'private' | 'protected' | 'public' |
                                    // 'return' | 'short' | 'static' | 'strictfp' | 'super' | 'switch' |
                                    // 'synchronized' | 'this' | 'throw' | 'transient' | 'try' | 'void' | 'volatile' |
                                    // 'while' | '{' | '}' | '~'
      switch (l1)
      {
      case 67:                      // 'else'
        lookahead2W(117);           // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 579                 // 'else' Identifier
       || lk == 707                 // 'else' IntegerLiteral
       || lk == 835                 // 'else' FloatingPointLiteral
       || lk == 963                 // 'else' BooleanLiteral
       || lk == 1091                // 'else' CharacterLiteral
       || lk == 1219                // 'else' StringLiteral
       || lk == 1347                // 'else' NullLiteral
       || lk == 1603                // 'else' '!'
       || lk == 2499                // 'else' '('
       || lk == 3011                // 'else' '+'
       || lk == 3139                // 'else' '++'
       || lk == 3523                // 'else' '-'
       || lk == 3651                // 'else' '--'
       || lk == 4547                // 'else' ';'
       || lk == 4675                // 'else' '<'
       || lk == 7107                // 'else' 'assert'
       || lk == 7235                // 'else' 'boolean'
       || lk == 7363                // 'else' 'break'
       || lk == 7491                // 'else' 'byte'
       || lk == 7875                // 'else' 'char'
       || lk == 8131                // 'else' 'continue'
       || lk == 8387                // 'else' 'do'
       || lk == 8515                // 'else' 'double'
       || lk == 9283                // 'else' 'float'
       || lk == 9411                // 'else' 'for'
       || lk == 9539                // 'else' 'if'
       || lk == 10051               // 'else' 'int'
       || lk == 10307               // 'else' 'long'
       || lk == 10563               // 'else' 'new'
       || lk == 11203               // 'else' 'return'
       || lk == 11331               // 'else' 'short'
       || lk == 11715               // 'else' 'super'
       || lk == 11843               // 'else' 'switch'
       || lk == 11971               // 'else' 'synchronized'
       || lk == 12099               // 'else' 'this'
       || lk == 12227               // 'else' 'throw'
       || lk == 12611               // 'else' 'try'
       || lk == 12739               // 'else' 'void'
       || lk == 12995               // 'else' 'while'
       || lk == 13123               // 'else' '{'
       || lk == 13763)              // 'else' '~'
      {
        lk = memoized(3, e0);
        if (lk == 0)
        {
          int b0A = b0; int e0A = e0; int l1A = l1;
          int b1A = b1; int e1A = e1; int l2A = l2;
          int b2A = b2; int e2A = e2;
          try
          {
            consumeT(67);           // 'else'
            lookahead1W(117);       // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
            try_Statement();
            lk = -1;
          }
          catch (ParseException &)
          {
            lk = -2;
          }
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; end = e2A; }}
          memoize(3, e0, lk);
        }
      }
      if (lk == -1)
      {
        consume(67);                // 'else'
        lookahead1W(117);           // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
        whitespace();
        parse_Statement();
      }
      break;
    case 55:                        // 'assert'
      consume(55);                  // 'assert'
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      whitespace();
      parse_Expression();
      if (l1 == 34)                 // ':'
      {
        consume(34);                // ':'
        lookahead1W(95);            // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
        whitespace();
        parse_Expression();
      }
      consume(35);                  // ';'
      break;
    case 92:                        // 'switch'
      consume(92);                  // 'switch'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      whitespace();
      parse_ParExpression();
      lookahead1W(19);              // WhiteSpace | Comment | '{'
      consume(102);                 // '{'
      lookahead1W(58);              // WhiteSpace | Comment | 'case' | 'default' | '}'
      whitespace();
      parse_SwitchBlockStatementGroups();
      consume(106);                 // '}'
      break;
    case 101:                       // 'while'
      consume(101);                 // 'while'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      whitespace();
      parse_ParExpression();
      lookahead1W(117);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
      whitespace();
      parse_Statement();
      break;
    case 65:                        // 'do'
      consume(65);                  // 'do'
      lookahead1W(117);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
      whitespace();
      parse_Statement();
      lookahead1W(18);              // WhiteSpace | Comment | 'while'
      consume(101);                 // 'while'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      whitespace();
      parse_ParExpression();
      lookahead1W(7);               // WhiteSpace | Comment | ';'
      consume(35);                  // ';'
      break;
    case 73:                        // 'for'
      consume(73);                  // 'for'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      consume(19);                  // '('
      lookahead1W(109);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'final' | 'float' | 'int' | 'long' | 'new' | 'short' | 'super' |
                                    // 'this' | 'void' | '~'
      whitespace();
      parse_ForControl();
      consume(20);                  // ')'
      lookahead1W(117);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
      whitespace();
      parse_Statement();
      break;
    case 57:                        // 'break'
      consume(57);                  // 'break'
      lookahead1W(22);              // WhiteSpace | Comment | Identifier | ';'
      if (l1 == 4)                  // Identifier
      {
        consume(4);                 // Identifier
      }
      lookahead1W(7);               // WhiteSpace | Comment | ';'
      consume(35);                  // ';'
      break;
    case 63:                        // 'continue'
      consume(63);                  // 'continue'
      lookahead1W(22);              // WhiteSpace | Comment | Identifier | ';'
      if (l1 == 4)                  // Identifier
      {
        consume(4);                 // Identifier
      }
      lookahead1W(7);               // WhiteSpace | Comment | ';'
      consume(35);                  // ';'
      break;
    case 87:                        // 'return'
      consume(87);                  // 'return'
      lookahead1W(98);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      if (l1 != 35)                 // ';'
      {
        whitespace();
        parse_Expression();
      }
      consume(35);                  // ';'
      break;
    case 95:                        // 'throw'
      consume(95);                  // 'throw'
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      whitespace();
      parse_Expression();
      consume(35);                  // ';'
      break;
    case 93:                        // 'synchronized'
      consume(93);                  // 'synchronized'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      whitespace();
      parse_ParExpression();
      lookahead1W(19);              // WhiteSpace | Comment | '{'
      whitespace();
      parse_Block();
      break;
    case 13154:                     // 'try' '{'
      consume(98);                  // 'try'
      lookahead1W(19);              // WhiteSpace | Comment | '{'
      whitespace();
      parse_Block();
      lookahead1W(42);              // WhiteSpace | Comment | 'catch' | 'finally'
      switch (l1)
      {
      case 60:                      // 'catch'
        lookahead2W(2);             // WhiteSpace | Comment | '('
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 2492)               // 'catch' '('
      {
        lk = memoized(4, e0);
        if (lk == 0)
        {
          int b0A = b0; int e0A = e0; int l1A = l1;
          int b1A = b1; int e1A = e1; int l2A = l2;
          int b2A = b2; int e2A = e2;
          try
          {
            if (l1 == 60)           // 'catch'
            {
              try_Catches();
            }
            try_Finally();
            lk = -1;
          }
          catch (ParseException &)
          {
            lk = -2;
          }
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; end = e2A; }}
          memoize(4, e0, lk);
        }
      }
      switch (lk)
      {
      case -2:
        whitespace();
        parse_Catches();
        break;
      default:
        if (l1 == 60)               // 'catch'
        {
          whitespace();
          parse_Catches();
        }
        whitespace();
        parse_Finally();
        break;
      }
      break;
    case 2530:                      // 'try' '('
      consume(98);                  // 'try'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      whitespace();
      parse_ResourceSpecification();
      lookahead1W(19);              // WhiteSpace | Comment | '{'
      whitespace();
      parse_Block();
      lookahead1W(128);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | '@' | 'abstract' | 'assert' | 'boolean' |
                                    // 'break' | 'byte' | 'case' | 'catch' | 'char' | 'class' | 'continue' | 'default' |
                                    // 'do' | 'double' | 'else' | 'enum' | 'final' | 'finally' | 'float' | 'for' |
                                    // 'if' | 'int' | 'interface' | 'long' | 'native' | 'new' | 'private' |
                                    // 'protected' | 'public' | 'return' | 'short' | 'static' | 'strictfp' | 'super' |
                                    // 'switch' | 'synchronized' | 'this' | 'throw' | 'transient' | 'try' | 'void' |
                                    // 'volatile' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // 'catch'
      {
        whitespace();
        parse_Catches();
      }
      if (l1 == 71)                 // 'finally'
      {
        whitespace();
        parse_Finally();
      }
      break;
    default:
      parse_StatementExpression();
      consume(35);                  // ';'
      break;
    }
    eventHandler->endNonterminal(L"Statement", e0);
  }

  void try_Statement()
  {
    switch (l1)
    {
    case 4:                         // Identifier
      lookahead2W(116);             // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | '*' | '*=' |
                                    // '+' | '++' | '+=' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' | ';' | '<' |
                                    // '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' | '>>>=' |
                                    // '?' | '[' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||'
      break;
    case 98:                        // 'try'
      lookahead2W(30);              // WhiteSpace | Comment | '(' | '{'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 102:                       // '{'
      try_Block();
      break;
    case 35:                        // ';'
      consumeT(35);                 // ';'
      break;
    case 4356:                      // Identifier ':'
      consumeT(4);                  // Identifier
      lookahead1W(6);               // WhiteSpace | Comment | ':'
      consumeT(34);                 // ':'
      lookahead1W(117);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
      try_Statement();
      break;
    case 74:                        // 'if'
      consumeT(74);                 // 'if'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      try_ParExpression();
      lookahead1W(117);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
      try_Statement();
      lookahead1W(127);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | '@' | 'abstract' | 'assert' | 'boolean' |
                                    // 'break' | 'byte' | 'case' | 'char' | 'class' | 'continue' | 'default' | 'do' |
                                    // 'double' | 'else' | 'enum' | 'final' | 'float' | 'for' | 'if' | 'int' |
                                    // 'interface' | 'long' | 'native' | 'new' | 'private' | 'protected' | 'public' |
                                    // 'return' | 'short' | 'static' | 'strictfp' | 'super' | 'switch' |
                                    // 'synchronized' | 'this' | 'throw' | 'transient' | 'try' | 'void' | 'volatile' |
                                    // 'while' | '{' | '}' | '~'
      switch (l1)
      {
      case 67:                      // 'else'
        lookahead2W(117);           // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 579                 // 'else' Identifier
       || lk == 707                 // 'else' IntegerLiteral
       || lk == 835                 // 'else' FloatingPointLiteral
       || lk == 963                 // 'else' BooleanLiteral
       || lk == 1091                // 'else' CharacterLiteral
       || lk == 1219                // 'else' StringLiteral
       || lk == 1347                // 'else' NullLiteral
       || lk == 1603                // 'else' '!'
       || lk == 2499                // 'else' '('
       || lk == 3011                // 'else' '+'
       || lk == 3139                // 'else' '++'
       || lk == 3523                // 'else' '-'
       || lk == 3651                // 'else' '--'
       || lk == 4547                // 'else' ';'
       || lk == 4675                // 'else' '<'
       || lk == 7107                // 'else' 'assert'
       || lk == 7235                // 'else' 'boolean'
       || lk == 7363                // 'else' 'break'
       || lk == 7491                // 'else' 'byte'
       || lk == 7875                // 'else' 'char'
       || lk == 8131                // 'else' 'continue'
       || lk == 8387                // 'else' 'do'
       || lk == 8515                // 'else' 'double'
       || lk == 9283                // 'else' 'float'
       || lk == 9411                // 'else' 'for'
       || lk == 9539                // 'else' 'if'
       || lk == 10051               // 'else' 'int'
       || lk == 10307               // 'else' 'long'
       || lk == 10563               // 'else' 'new'
       || lk == 11203               // 'else' 'return'
       || lk == 11331               // 'else' 'short'
       || lk == 11715               // 'else' 'super'
       || lk == 11843               // 'else' 'switch'
       || lk == 11971               // 'else' 'synchronized'
       || lk == 12099               // 'else' 'this'
       || lk == 12227               // 'else' 'throw'
       || lk == 12611               // 'else' 'try'
       || lk == 12739               // 'else' 'void'
       || lk == 12995               // 'else' 'while'
       || lk == 13123               // 'else' '{'
       || lk == 13763)              // 'else' '~'
      {
        lk = memoized(3, e0);
        if (lk == 0)
        {
          int b0A = b0; int e0A = e0; int l1A = l1;
          int b1A = b1; int e1A = e1; int l2A = l2;
          int b2A = b2; int e2A = e2;
          try
          {
            consumeT(67);           // 'else'
            lookahead1W(117);       // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
            try_Statement();
            memoize(3, e0A, -1);
          }
          catch (ParseException &)
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; end = e2A; }}
            memoize(3, e0A, -2);
          }
          lk = -2;
        }
      }
      if (lk == -1)
      {
        consumeT(67);               // 'else'
        lookahead1W(117);           // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
        try_Statement();
      }
      break;
    case 55:                        // 'assert'
      consumeT(55);                 // 'assert'
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      try_Expression();
      if (l1 == 34)                 // ':'
      {
        consumeT(34);               // ':'
        lookahead1W(95);            // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
        try_Expression();
      }
      consumeT(35);                 // ';'
      break;
    case 92:                        // 'switch'
      consumeT(92);                 // 'switch'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      try_ParExpression();
      lookahead1W(19);              // WhiteSpace | Comment | '{'
      consumeT(102);                // '{'
      lookahead1W(58);              // WhiteSpace | Comment | 'case' | 'default' | '}'
      try_SwitchBlockStatementGroups();
      consumeT(106);                // '}'
      break;
    case 101:                       // 'while'
      consumeT(101);                // 'while'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      try_ParExpression();
      lookahead1W(117);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
      try_Statement();
      break;
    case 65:                        // 'do'
      consumeT(65);                 // 'do'
      lookahead1W(117);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
      try_Statement();
      lookahead1W(18);              // WhiteSpace | Comment | 'while'
      consumeT(101);                // 'while'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      try_ParExpression();
      lookahead1W(7);               // WhiteSpace | Comment | ';'
      consumeT(35);                 // ';'
      break;
    case 73:                        // 'for'
      consumeT(73);                 // 'for'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      consumeT(19);                 // '('
      lookahead1W(109);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'final' | 'float' | 'int' | 'long' | 'new' | 'short' | 'super' |
                                    // 'this' | 'void' | '~'
      try_ForControl();
      consumeT(20);                 // ')'
      lookahead1W(117);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'assert' | 'boolean' | 'break' | 'byte' |
                                    // 'char' | 'continue' | 'do' | 'double' | 'float' | 'for' | 'if' | 'int' | 'long' |
                                    // 'new' | 'return' | 'short' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'try' | 'void' | 'while' | '{' | '~'
      try_Statement();
      break;
    case 57:                        // 'break'
      consumeT(57);                 // 'break'
      lookahead1W(22);              // WhiteSpace | Comment | Identifier | ';'
      if (l1 == 4)                  // Identifier
      {
        consumeT(4);                // Identifier
      }
      lookahead1W(7);               // WhiteSpace | Comment | ';'
      consumeT(35);                 // ';'
      break;
    case 63:                        // 'continue'
      consumeT(63);                 // 'continue'
      lookahead1W(22);              // WhiteSpace | Comment | Identifier | ';'
      if (l1 == 4)                  // Identifier
      {
        consumeT(4);                // Identifier
      }
      lookahead1W(7);               // WhiteSpace | Comment | ';'
      consumeT(35);                 // ';'
      break;
    case 87:                        // 'return'
      consumeT(87);                 // 'return'
      lookahead1W(98);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      if (l1 != 35)                 // ';'
      {
        try_Expression();
      }
      consumeT(35);                 // ';'
      break;
    case 95:                        // 'throw'
      consumeT(95);                 // 'throw'
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      try_Expression();
      consumeT(35);                 // ';'
      break;
    case 93:                        // 'synchronized'
      consumeT(93);                 // 'synchronized'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      try_ParExpression();
      lookahead1W(19);              // WhiteSpace | Comment | '{'
      try_Block();
      break;
    case 13154:                     // 'try' '{'
      consumeT(98);                 // 'try'
      lookahead1W(19);              // WhiteSpace | Comment | '{'
      try_Block();
      lookahead1W(42);              // WhiteSpace | Comment | 'catch' | 'finally'
      switch (l1)
      {
      case 60:                      // 'catch'
        lookahead2W(2);             // WhiteSpace | Comment | '('
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 2492)               // 'catch' '('
      {
        lk = memoized(4, e0);
        if (lk == 0)
        {
          int b0A = b0; int e0A = e0; int l1A = l1;
          int b1A = b1; int e1A = e1; int l2A = l2;
          int b2A = b2; int e2A = e2;
          try
          {
            if (l1 == 60)           // 'catch'
            {
              try_Catches();
            }
            try_Finally();
            memoize(4, e0A, -1);
            lk = -3;
          }
          catch (ParseException &)
          {
            lk = -2;
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; end = e2A; }}
            memoize(4, e0A, -2);
          }
        }
      }
      switch (lk)
      {
      case -2:
        try_Catches();
        break;
      case -3:
        break;
      default:
        if (l1 == 60)               // 'catch'
        {
          try_Catches();
        }
        try_Finally();
        break;
      }
      break;
    case 2530:                      // 'try' '('
      consumeT(98);                 // 'try'
      lookahead1W(2);               // WhiteSpace | Comment | '('
      try_ResourceSpecification();
      lookahead1W(19);              // WhiteSpace | Comment | '{'
      try_Block();
      lookahead1W(128);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | '@' | 'abstract' | 'assert' | 'boolean' |
                                    // 'break' | 'byte' | 'case' | 'catch' | 'char' | 'class' | 'continue' | 'default' |
                                    // 'do' | 'double' | 'else' | 'enum' | 'final' | 'finally' | 'float' | 'for' |
                                    // 'if' | 'int' | 'interface' | 'long' | 'native' | 'new' | 'private' |
                                    // 'protected' | 'public' | 'return' | 'short' | 'static' | 'strictfp' | 'super' |
                                    // 'switch' | 'synchronized' | 'this' | 'throw' | 'transient' | 'try' | 'void' |
                                    // 'volatile' | 'while' | '{' | '}' | '~'
      if (l1 == 60)                 // 'catch'
      {
        try_Catches();
      }
      if (l1 == 71)                 // 'finally'
      {
        try_Finally();
      }
      break;
    default:
      try_StatementExpression();
      consumeT(35);                 // ';'
      break;
    }
  }

  void parse_StatementExpression()
  {
    eventHandler->startNonterminal(L"StatementExpression", e0);
    parse_Expression();
    eventHandler->endNonterminal(L"StatementExpression", e0);
  }

  void try_StatementExpression()
  {
    try_Expression();
  }

  void parse_Catches()
  {
    eventHandler->startNonterminal(L"Catches", e0);
    for (;;)
    {
      whitespace();
      parse_CatchClause();
      lookahead1W(128);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | '@' | 'abstract' | 'assert' | 'boolean' |
                                    // 'break' | 'byte' | 'case' | 'catch' | 'char' | 'class' | 'continue' | 'default' |
                                    // 'do' | 'double' | 'else' | 'enum' | 'final' | 'finally' | 'float' | 'for' |
                                    // 'if' | 'int' | 'interface' | 'long' | 'native' | 'new' | 'private' |
                                    // 'protected' | 'public' | 'return' | 'short' | 'static' | 'strictfp' | 'super' |
                                    // 'switch' | 'synchronized' | 'this' | 'throw' | 'transient' | 'try' | 'void' |
                                    // 'volatile' | 'while' | '{' | '}' | '~'
      if (l1 != 60)                 // 'catch'
      {
        break;
      }
    }
    eventHandler->endNonterminal(L"Catches", e0);
  }

  void try_Catches()
  {
    for (;;)
    {
      try_CatchClause();
      lookahead1W(128);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | '@' | 'abstract' | 'assert' | 'boolean' |
                                    // 'break' | 'byte' | 'case' | 'catch' | 'char' | 'class' | 'continue' | 'default' |
                                    // 'do' | 'double' | 'else' | 'enum' | 'final' | 'finally' | 'float' | 'for' |
                                    // 'if' | 'int' | 'interface' | 'long' | 'native' | 'new' | 'private' |
                                    // 'protected' | 'public' | 'return' | 'short' | 'static' | 'strictfp' | 'super' |
                                    // 'switch' | 'synchronized' | 'this' | 'throw' | 'transient' | 'try' | 'void' |
                                    // 'volatile' | 'while' | '{' | '}' | '~'
      if (l1 != 60)                 // 'catch'
      {
        break;
      }
    }
  }

  void parse_CatchClause()
  {
    eventHandler->startNonterminal(L"CatchClause", e0);
    consume(60);                    // 'catch'
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    consume(19);                    // '('
    for (;;)
    {
      lookahead1W(47);              // WhiteSpace | Comment | Identifier | '@' | 'final'
      if (l1 == 4)                  // Identifier
      {
        break;
      }
      whitespace();
      parse_VariableModifier();
    }
    whitespace();
    parse_CatchType();
    consume(4);                     // Identifier
    lookahead1W(3);                 // WhiteSpace | Comment | ')'
    consume(20);                    // ')'
    lookahead1W(19);                // WhiteSpace | Comment | '{'
    whitespace();
    parse_Block();
    eventHandler->endNonterminal(L"CatchClause", e0);
  }

  void try_CatchClause()
  {
    consumeT(60);                   // 'catch'
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    consumeT(19);                   // '('
    for (;;)
    {
      lookahead1W(47);              // WhiteSpace | Comment | Identifier | '@' | 'final'
      if (l1 == 4)                  // Identifier
      {
        break;
      }
      try_VariableModifier();
    }
    try_CatchType();
    consumeT(4);                    // Identifier
    lookahead1W(3);                 // WhiteSpace | Comment | ')'
    consumeT(20);                   // ')'
    lookahead1W(19);                // WhiteSpace | Comment | '{'
    try_Block();
  }

  void parse_CatchType()
  {
    eventHandler->startNonterminal(L"CatchType", e0);
    parse_QualifiedIdentifier();
    for (;;)
    {
      if (l1 != 103)                // '|'
      {
        break;
      }
      consume(103);                 // '|'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_QualifiedIdentifier();
    }
    eventHandler->endNonterminal(L"CatchType", e0);
  }

  void try_CatchType()
  {
    try_QualifiedIdentifier();
    for (;;)
    {
      if (l1 != 103)                // '|'
      {
        break;
      }
      consumeT(103);                // '|'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_QualifiedIdentifier();
    }
  }

  void parse_Finally()
  {
    eventHandler->startNonterminal(L"Finally", e0);
    consume(71);                    // 'finally'
    lookahead1W(19);                // WhiteSpace | Comment | '{'
    whitespace();
    parse_Block();
    eventHandler->endNonterminal(L"Finally", e0);
  }

  void try_Finally()
  {
    consumeT(71);                   // 'finally'
    lookahead1W(19);                // WhiteSpace | Comment | '{'
    try_Block();
  }

  void parse_ResourceSpecification()
  {
    eventHandler->startNonterminal(L"ResourceSpecification", e0);
    consume(19);                    // '('
    lookahead1W(47);                // WhiteSpace | Comment | Identifier | '@' | 'final'
    whitespace();
    parse_Resources();
    if (l1 == 35)                   // ';'
    {
      consume(35);                  // ';'
    }
    lookahead1W(3);                 // WhiteSpace | Comment | ')'
    consume(20);                    // ')'
    eventHandler->endNonterminal(L"ResourceSpecification", e0);
  }

  void try_ResourceSpecification()
  {
    consumeT(19);                   // '('
    lookahead1W(47);                // WhiteSpace | Comment | Identifier | '@' | 'final'
    try_Resources();
    if (l1 == 35)                   // ';'
    {
      consumeT(35);                 // ';'
    }
    lookahead1W(3);                 // WhiteSpace | Comment | ')'
    consumeT(20);                   // ')'
  }

  void parse_Resources()
  {
    eventHandler->startNonterminal(L"Resources", e0);
    parse_Resource();
    for (;;)
    {
      switch (l1)
      {
      case 35:                      // ';'
        lookahead2W(60);            // WhiteSpace | Comment | Identifier | ')' | '@' | 'final'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 20                  // ')'
       || lk == 2595)               // ';' ')'
      {
        break;
      }
      consume(35);                  // ';'
      lookahead1W(47);              // WhiteSpace | Comment | Identifier | '@' | 'final'
      whitespace();
      parse_Resource();
    }
    eventHandler->endNonterminal(L"Resources", e0);
  }

  void try_Resources()
  {
    try_Resource();
    for (;;)
    {
      switch (l1)
      {
      case 35:                      // ';'
        lookahead2W(60);            // WhiteSpace | Comment | Identifier | ')' | '@' | 'final'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 20                  // ')'
       || lk == 2595)               // ';' ')'
      {
        break;
      }
      consumeT(35);                 // ';'
      lookahead1W(47);              // WhiteSpace | Comment | Identifier | '@' | 'final'
      try_Resource();
    }
  }

  void parse_Resource()
  {
    eventHandler->startNonterminal(L"Resource", e0);
    for (;;)
    {
      lookahead1W(47);              // WhiteSpace | Comment | Identifier | '@' | 'final'
      if (l1 == 4)                  // Identifier
      {
        break;
      }
      whitespace();
      parse_VariableModifier();
    }
    whitespace();
    parse_ReferenceType();
    whitespace();
    parse_VariableDeclaratorId();
    consume(40);                    // '='
    lookahead1W(95);                // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
    whitespace();
    parse_Expression();
    eventHandler->endNonterminal(L"Resource", e0);
  }

  void try_Resource()
  {
    for (;;)
    {
      lookahead1W(47);              // WhiteSpace | Comment | Identifier | '@' | 'final'
      if (l1 == 4)                  // Identifier
      {
        break;
      }
      try_VariableModifier();
    }
    try_ReferenceType();
    try_VariableDeclaratorId();
    consumeT(40);                   // '='
    lookahead1W(95);                // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
    try_Expression();
  }

  void parse_SwitchBlockStatementGroups()
  {
    eventHandler->startNonterminal(L"SwitchBlockStatementGroups", e0);
    for (;;)
    {
      if (l1 == 106)                // '}'
      {
        break;
      }
      whitespace();
      parse_SwitchBlockStatementGroup();
    }
    eventHandler->endNonterminal(L"SwitchBlockStatementGroups", e0);
  }

  void try_SwitchBlockStatementGroups()
  {
    for (;;)
    {
      if (l1 == 106)                // '}'
      {
        break;
      }
      try_SwitchBlockStatementGroup();
    }
  }

  void parse_SwitchBlockStatementGroup()
  {
    eventHandler->startNonterminal(L"SwitchBlockStatementGroup", e0);
    parse_SwitchLabels();
    whitespace();
    parse_BlockStatements();
    eventHandler->endNonterminal(L"SwitchBlockStatementGroup", e0);
  }

  void try_SwitchBlockStatementGroup()
  {
    try_SwitchLabels();
    try_BlockStatements();
  }

  void parse_SwitchLabels()
  {
    eventHandler->startNonterminal(L"SwitchLabels", e0);
    for (;;)
    {
      whitespace();
      parse_SwitchLabel();
      lookahead1W(126);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | '@' | 'abstract' | 'assert' | 'boolean' |
                                    // 'break' | 'byte' | 'case' | 'char' | 'class' | 'continue' | 'default' | 'do' |
                                    // 'double' | 'enum' | 'final' | 'float' | 'for' | 'if' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'new' | 'private' | 'protected' | 'public' | 'return' |
                                    // 'short' | 'static' | 'strictfp' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'transient' | 'try' | 'void' | 'volatile' | 'while' | '{' | '}' | '~'
      switch (l1)
      {
      case 59:                      // 'case'
        lookahead2W(95);            // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
        break;
      case 64:                      // 'default'
        lookahead2W(6);             // WhiteSpace | Comment | ':'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 571                 // 'case' Identifier
       || lk == 699                 // 'case' IntegerLiteral
       || lk == 827                 // 'case' FloatingPointLiteral
       || lk == 955                 // 'case' BooleanLiteral
       || lk == 1083                // 'case' CharacterLiteral
       || lk == 1211                // 'case' StringLiteral
       || lk == 1339                // 'case' NullLiteral
       || lk == 1595                // 'case' '!'
       || lk == 2491                // 'case' '('
       || lk == 3003                // 'case' '+'
       || lk == 3131                // 'case' '++'
       || lk == 3515                // 'case' '-'
       || lk == 3643                // 'case' '--'
       || lk == 4416                // 'default' ':'
       || lk == 4667                // 'case' '<'
       || lk == 7227                // 'case' 'boolean'
       || lk == 7483                // 'case' 'byte'
       || lk == 7867                // 'case' 'char'
       || lk == 8507                // 'case' 'double'
       || lk == 9275                // 'case' 'float'
       || lk == 10043               // 'case' 'int'
       || lk == 10299               // 'case' 'long'
       || lk == 10555               // 'case' 'new'
       || lk == 11323               // 'case' 'short'
       || lk == 11707               // 'case' 'super'
       || lk == 12091               // 'case' 'this'
       || lk == 12731               // 'case' 'void'
       || lk == 13755)              // 'case' '~'
      {
        lk = memoized(5, e0);
        if (lk == 0)
        {
          int b0A = b0; int e0A = e0; int l1A = l1;
          int b1A = b1; int e1A = e1; int l2A = l2;
          int b2A = b2; int e2A = e2;
          try
          {
            try_SwitchLabel();
            lk = -1;
          }
          catch (ParseException &)
          {
            lk = -2;
          }
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; end = e2A; }}
          memoize(5, e0, lk);
        }
      }
      if (lk != -1)
      {
        break;
      }
    }
    eventHandler->endNonterminal(L"SwitchLabels", e0);
  }

  void try_SwitchLabels()
  {
    try_SwitchLabel();
    for (;;)
    {
      lookahead1W(126);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | '@' | 'abstract' | 'assert' | 'boolean' |
                                    // 'break' | 'byte' | 'case' | 'char' | 'class' | 'continue' | 'default' | 'do' |
                                    // 'double' | 'enum' | 'final' | 'float' | 'for' | 'if' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'new' | 'private' | 'protected' | 'public' | 'return' |
                                    // 'short' | 'static' | 'strictfp' | 'super' | 'switch' | 'synchronized' | 'this' |
                                    // 'throw' | 'transient' | 'try' | 'void' | 'volatile' | 'while' | '{' | '}' | '~'
      switch (l1)
      {
      case 59:                      // 'case'
        lookahead2W(95);            // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
        break;
      case 64:                      // 'default'
        lookahead2W(6);             // WhiteSpace | Comment | ':'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 571                 // 'case' Identifier
       || lk == 699                 // 'case' IntegerLiteral
       || lk == 827                 // 'case' FloatingPointLiteral
       || lk == 955                 // 'case' BooleanLiteral
       || lk == 1083                // 'case' CharacterLiteral
       || lk == 1211                // 'case' StringLiteral
       || lk == 1339                // 'case' NullLiteral
       || lk == 1595                // 'case' '!'
       || lk == 2491                // 'case' '('
       || lk == 3003                // 'case' '+'
       || lk == 3131                // 'case' '++'
       || lk == 3515                // 'case' '-'
       || lk == 3643                // 'case' '--'
       || lk == 4416                // 'default' ':'
       || lk == 4667                // 'case' '<'
       || lk == 7227                // 'case' 'boolean'
       || lk == 7483                // 'case' 'byte'
       || lk == 7867                // 'case' 'char'
       || lk == 8507                // 'case' 'double'
       || lk == 9275                // 'case' 'float'
       || lk == 10043               // 'case' 'int'
       || lk == 10299               // 'case' 'long'
       || lk == 10555               // 'case' 'new'
       || lk == 11323               // 'case' 'short'
       || lk == 11707               // 'case' 'super'
       || lk == 12091               // 'case' 'this'
       || lk == 12731               // 'case' 'void'
       || lk == 13755)              // 'case' '~'
      {
        lk = memoized(5, e0);
        if (lk == 0)
        {
          int b0A = b0; int e0A = e0; int l1A = l1;
          int b1A = b1; int e1A = e1; int l2A = l2;
          int b2A = b2; int e2A = e2;
          try
          {
            try_SwitchLabel();
            memoize(5, e0A, -1);
            continue;
          }
          catch (ParseException &)
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; end = e2A; }}
            memoize(5, e0A, -2);
            break;
          }
        }
      }
      if (lk != -1)
      {
        break;
      }
      try_SwitchLabel();
    }
  }

  void parse_SwitchLabel()
  {
    eventHandler->startNonterminal(L"SwitchLabel", e0);
    switch (l1)
    {
    case 59:                        // 'case'
      lookahead2W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      break;
    default:
      lk = l1;
      break;
    }
    if (lk == 571)                  // 'case' Identifier
    {
      lk = memoized(6, e0);
      if (lk == 0)
      {
        int b0A = b0; int e0A = e0; int l1A = l1;
        int b1A = b1; int e1A = e1; int l2A = l2;
        int b2A = b2; int e2A = e2;
        try
        {
          consumeT(59);             // 'case'
          lookahead1W(95);          // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
          try_Expression();
          consumeT(34);             // ':'
          lk = -1;
        }
        catch (ParseException &)
        {
          lk = -2;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
        b2 = b2A; e2 = e2A; end = e2A; }}
        memoize(6, e0, lk);
      }
    }
    switch (lk)
    {
    case -2:
      consume(59);                  // 'case'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_EnumConstantName();
      lookahead1W(6);               // WhiteSpace | Comment | ':'
      consume(34);                  // ':'
      break;
    case 64:                        // 'default'
      consume(64);                  // 'default'
      lookahead1W(6);               // WhiteSpace | Comment | ':'
      consume(34);                  // ':'
      break;
    default:
      consume(59);                  // 'case'
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      whitespace();
      parse_Expression();
      consume(34);                  // ':'
      break;
    }
    eventHandler->endNonterminal(L"SwitchLabel", e0);
  }

  void try_SwitchLabel()
  {
    switch (l1)
    {
    case 59:                        // 'case'
      lookahead2W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      break;
    default:
      lk = l1;
      break;
    }
    if (lk == 571)                  // 'case' Identifier
    {
      lk = memoized(6, e0);
      if (lk == 0)
      {
        int b0A = b0; int e0A = e0; int l1A = l1;
        int b1A = b1; int e1A = e1; int l2A = l2;
        int b2A = b2; int e2A = e2;
        try
        {
          consumeT(59);             // 'case'
          lookahead1W(95);          // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
          try_Expression();
          consumeT(34);             // ':'
          memoize(6, e0A, -1);
          lk = -4;
        }
        catch (ParseException &)
        {
          lk = -2;
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; end = e2A; }}
          memoize(6, e0A, -2);
        }
      }
    }
    switch (lk)
    {
    case -2:
      consumeT(59);                 // 'case'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_EnumConstantName();
      lookahead1W(6);               // WhiteSpace | Comment | ':'
      consumeT(34);                 // ':'
      break;
    case 64:                        // 'default'
      consumeT(64);                 // 'default'
      lookahead1W(6);               // WhiteSpace | Comment | ':'
      consumeT(34);                 // ':'
      break;
    case -4:
      break;
    default:
      consumeT(59);                 // 'case'
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      try_Expression();
      consumeT(34);                 // ':'
      break;
    }
  }

  void parse_EnumConstantName()
  {
    eventHandler->startNonterminal(L"EnumConstantName", e0);
    consume(4);                     // Identifier
    eventHandler->endNonterminal(L"EnumConstantName", e0);
  }

  void try_EnumConstantName()
  {
    consumeT(4);                    // Identifier
  }

  void parse_ForControl()
  {
    eventHandler->startNonterminal(L"ForControl", e0);
    switch (l1)
    {
    case 4:                         // Identifier
      lookahead2W(118);             // WhiteSpace | Comment | Identifier | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '>>>' | '>>>=' | '?' | '[' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||'
      break;
    case 56:                        // 'boolean'
    case 58:                        // 'byte'
    case 61:                        // 'char'
    case 66:                        // 'double'
    case 72:                        // 'float'
    case 78:                        // 'int'
    case 80:                        // 'long'
    case 88:                        // 'short'
      lookahead2W(46);              // WhiteSpace | Comment | Identifier | '.' | '['
      break;
    default:
      lk = l1;
      break;
    }
    if (lk == 3844                  // Identifier '.'
     || lk == 4612                  // Identifier '<'
     || lk == 6404                  // Identifier '['
     || lk == 6456                  // 'boolean' '['
     || lk == 6458                  // 'byte' '['
     || lk == 6461                  // 'char' '['
     || lk == 6466                  // 'double' '['
     || lk == 6472                  // 'float' '['
     || lk == 6478                  // 'int' '['
     || lk == 6480                  // 'long' '['
     || lk == 6488)                 // 'short' '['
    {
      lk = memoized(7, e0);
      if (lk == 0)
      {
        int b0A = b0; int e0A = e0; int l1A = l1;
        int b1A = b1; int e1A = e1; int l2A = l2;
        int b2A = b2; int e2A = e2;
        try
        {
          try_ForVarControl();
          lk = -1;
        }
        catch (ParseException &)
        {
          lk = -2;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
        b2 = b2A; e2 = e2A; end = e2A; }}
        memoize(7, e0, lk);
      }
    }
    switch (lk)
    {
    case -1:
    case 49:                        // '@'
    case 70:                        // 'final'
    case 516:                       // Identifier Identifier
    case 568:                       // 'boolean' Identifier
    case 570:                       // 'byte' Identifier
    case 573:                       // 'char' Identifier
    case 578:                       // 'double' Identifier
    case 584:                       // 'float' Identifier
    case 590:                       // 'int' Identifier
    case 592:                       // 'long' Identifier
    case 600:                       // 'short' Identifier
      parse_ForVarControl();
      break;
    default:
      if (l1 != 35)                 // ';'
      {
        whitespace();
        parse_ForInit();
      }
      consume(35);                  // ';'
      lookahead1W(98);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      if (l1 != 35)                 // ';'
      {
        whitespace();
        parse_Expression();
      }
      consume(35);                  // ';'
      lookahead1W(97);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // ')' | '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      if (l1 != 20)                 // ')'
      {
        whitespace();
        parse_ForUpdate();
      }
      break;
    }
    eventHandler->endNonterminal(L"ForControl", e0);
  }

  void try_ForControl()
  {
    switch (l1)
    {
    case 4:                         // Identifier
      lookahead2W(118);             // WhiteSpace | Comment | Identifier | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' |
                                    // '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '>>>' | '>>>=' | '?' | '[' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||'
      break;
    case 56:                        // 'boolean'
    case 58:                        // 'byte'
    case 61:                        // 'char'
    case 66:                        // 'double'
    case 72:                        // 'float'
    case 78:                        // 'int'
    case 80:                        // 'long'
    case 88:                        // 'short'
      lookahead2W(46);              // WhiteSpace | Comment | Identifier | '.' | '['
      break;
    default:
      lk = l1;
      break;
    }
    if (lk == 3844                  // Identifier '.'
     || lk == 4612                  // Identifier '<'
     || lk == 6404                  // Identifier '['
     || lk == 6456                  // 'boolean' '['
     || lk == 6458                  // 'byte' '['
     || lk == 6461                  // 'char' '['
     || lk == 6466                  // 'double' '['
     || lk == 6472                  // 'float' '['
     || lk == 6478                  // 'int' '['
     || lk == 6480                  // 'long' '['
     || lk == 6488)                 // 'short' '['
    {
      lk = memoized(7, e0);
      if (lk == 0)
      {
        int b0A = b0; int e0A = e0; int l1A = l1;
        int b1A = b1; int e1A = e1; int l2A = l2;
        int b2A = b2; int e2A = e2;
        try
        {
          try_ForVarControl();
          memoize(7, e0A, -1);
          lk = -3;
        }
        catch (ParseException &)
        {
          lk = -2;
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; end = e2A; }}
          memoize(7, e0A, -2);
        }
      }
    }
    switch (lk)
    {
    case -1:
    case 49:                        // '@'
    case 70:                        // 'final'
    case 516:                       // Identifier Identifier
    case 568:                       // 'boolean' Identifier
    case 570:                       // 'byte' Identifier
    case 573:                       // 'char' Identifier
    case 578:                       // 'double' Identifier
    case 584:                       // 'float' Identifier
    case 590:                       // 'int' Identifier
    case 592:                       // 'long' Identifier
    case 600:                       // 'short' Identifier
      try_ForVarControl();
      break;
    case -3:
      break;
    default:
      if (l1 != 35)                 // ';'
      {
        try_ForInit();
      }
      consumeT(35);                 // ';'
      lookahead1W(98);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      if (l1 != 35)                 // ';'
      {
        try_Expression();
      }
      consumeT(35);                 // ';'
      lookahead1W(97);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // ')' | '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      if (l1 != 20)                 // ')'
      {
        try_ForUpdate();
      }
      break;
    }
  }

  void parse_ForVarControl()
  {
    eventHandler->startNonterminal(L"ForVarControl", e0);
    for (;;)
    {
      lookahead1W(84);              // WhiteSpace | Comment | Identifier | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'final' | 'float' | 'int' | 'long' | 'short'
      if (l1 != 49                  // '@'
       && l1 != 70)                 // 'final'
      {
        break;
      }
      whitespace();
      parse_VariableModifier();
    }
    whitespace();
    parse_Type();
    whitespace();
    parse_VariableDeclaratorId();
    whitespace();
    parse_ForVarControlRest();
    eventHandler->endNonterminal(L"ForVarControl", e0);
  }

  void try_ForVarControl()
  {
    for (;;)
    {
      lookahead1W(84);              // WhiteSpace | Comment | Identifier | '@' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'final' | 'float' | 'int' | 'long' | 'short'
      if (l1 != 49                  // '@'
       && l1 != 70)                 // 'final'
      {
        break;
      }
      try_VariableModifier();
    }
    try_Type();
    try_VariableDeclaratorId();
    try_ForVarControlRest();
  }

  void parse_ForVarControlRest()
  {
    eventHandler->startNonterminal(L"ForVarControlRest", e0);
    switch (l1)
    {
    case 34:                        // ':'
      consume(34);                  // ':'
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      whitespace();
      parse_Expression();
      break;
    default:
      parse_ForVariableDeclaratorsRest();
      consume(35);                  // ';'
      lookahead1W(98);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      if (l1 != 35)                 // ';'
      {
        whitespace();
        parse_Expression();
      }
      consume(35);                  // ';'
      lookahead1W(97);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // ')' | '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      if (l1 != 20)                 // ')'
      {
        whitespace();
        parse_ForUpdate();
      }
      break;
    }
    eventHandler->endNonterminal(L"ForVarControlRest", e0);
  }

  void try_ForVarControlRest()
  {
    switch (l1)
    {
    case 34:                        // ':'
      consumeT(34);                 // ':'
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      try_Expression();
      break;
    default:
      try_ForVariableDeclaratorsRest();
      consumeT(35);                 // ';'
      lookahead1W(98);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | ';' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      if (l1 != 35)                 // ';'
      {
        try_Expression();
      }
      consumeT(35);                 // ';'
      lookahead1W(97);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // ')' | '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      if (l1 != 20)                 // ')'
      {
        try_ForUpdate();
      }
      break;
    }
  }

  void parse_ForVariableDeclaratorsRest()
  {
    eventHandler->startNonterminal(L"ForVariableDeclaratorsRest", e0);
    if (l1 == 40)                   // '='
    {
      consume(40);                  // '='
      lookahead1W(100);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '~'
      whitespace();
      parse_VariableInitializer();
    }
    for (;;)
    {
      lookahead1W(33);              // WhiteSpace | Comment | ',' | ';'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_VariableDeclarator();
    }
    eventHandler->endNonterminal(L"ForVariableDeclaratorsRest", e0);
  }

  void try_ForVariableDeclaratorsRest()
  {
    if (l1 == 40)                   // '='
    {
      consumeT(40);                 // '='
      lookahead1W(100);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '~'
      try_VariableInitializer();
    }
    for (;;)
    {
      lookahead1W(33);              // WhiteSpace | Comment | ',' | ';'
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_VariableDeclarator();
    }
  }

  void parse_ForInit()
  {
    eventHandler->startNonterminal(L"ForInit", e0);
    parse_StatementExpression();
    for (;;)
    {
      if (l1 != 26)                 // ','
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      whitespace();
      parse_StatementExpression();
    }
    eventHandler->endNonterminal(L"ForInit", e0);
  }

  void try_ForInit()
  {
    try_StatementExpression();
    for (;;)
    {
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      try_StatementExpression();
    }
  }

  void parse_ForUpdate()
  {
    eventHandler->startNonterminal(L"ForUpdate", e0);
    parse_StatementExpression();
    for (;;)
    {
      if (l1 != 26)                 // ','
      {
        break;
      }
      consume(26);                  // ','
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      whitespace();
      parse_StatementExpression();
    }
    eventHandler->endNonterminal(L"ForUpdate", e0);
  }

  void try_ForUpdate()
  {
    try_StatementExpression();
    for (;;)
    {
      if (l1 != 26)                 // ','
      {
        break;
      }
      consumeT(26);                 // ','
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      try_StatementExpression();
    }
  }

  void parse_Expression()
  {
    eventHandler->startNonterminal(L"Expression", e0);
    parse_Expression1();
    if (l1 != 20                    // ')'
     && l1 != 26                    // ','
     && l1 != 34                    // ':'
     && l1 != 35                    // ';'
     && l1 != 51                    // ']'
     && l1 != 106)                  // '}'
    {
      whitespace();
      parse_AssignmentOperator();
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      whitespace();
      parse_Expression();
    }
    eventHandler->endNonterminal(L"Expression", e0);
  }

  void try_Expression()
  {
    try_Expression1();
    if (l1 != 20                    // ')'
     && l1 != 26                    // ','
     && l1 != 34                    // ':'
     && l1 != 35                    // ';'
     && l1 != 51                    // ']'
     && l1 != 106)                  // '}'
    {
      try_AssignmentOperator();
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      try_Expression();
    }
  }

  void parse_AssignmentOperator()
  {
    eventHandler->startNonterminal(L"AssignmentOperator", e0);
    switch (l1)
    {
    case 40:                        // '='
      consume(40);                  // '='
      break;
    case 25:                        // '+='
      consume(25);                  // '+='
      break;
    case 29:                        // '-='
      consume(29);                  // '-='
      break;
    case 22:                        // '*='
      consume(22);                  // '*='
      break;
    case 33:                        // '/='
      consume(33);                  // '/='
      break;
    case 18:                        // '&='
      consume(18);                  // '&='
      break;
    case 104:                       // '|='
      consume(104);                 // '|='
      break;
    case 53:                        // '^='
      consume(53);                  // '^='
      break;
    case 15:                        // '%='
      consume(15);                  // '%='
      break;
    case 38:                        // '<<='
      consume(38);                  // '<<='
      break;
    case 45:                        // '>>='
      consume(45);                  // '>>='
      break;
    default:
      consume(47);                  // '>>>='
      break;
    }
    eventHandler->endNonterminal(L"AssignmentOperator", e0);
  }

  void try_AssignmentOperator()
  {
    switch (l1)
    {
    case 40:                        // '='
      consumeT(40);                 // '='
      break;
    case 25:                        // '+='
      consumeT(25);                 // '+='
      break;
    case 29:                        // '-='
      consumeT(29);                 // '-='
      break;
    case 22:                        // '*='
      consumeT(22);                 // '*='
      break;
    case 33:                        // '/='
      consumeT(33);                 // '/='
      break;
    case 18:                        // '&='
      consumeT(18);                 // '&='
      break;
    case 104:                       // '|='
      consumeT(104);                // '|='
      break;
    case 53:                        // '^='
      consumeT(53);                 // '^='
      break;
    case 15:                        // '%='
      consumeT(15);                 // '%='
      break;
    case 38:                        // '<<='
      consumeT(38);                 // '<<='
      break;
    case 45:                        // '>>='
      consumeT(45);                 // '>>='
      break;
    default:
      consumeT(47);                 // '>>>='
      break;
    }
  }

  void parse_Expression1()
  {
    eventHandler->startNonterminal(L"Expression1", e0);
    parse_Expression2();
    if (l1 == 48)                   // '?'
    {
      whitespace();
      parse_Expression1Rest();
    }
    eventHandler->endNonterminal(L"Expression1", e0);
  }

  void try_Expression1()
  {
    try_Expression2();
    if (l1 == 48)                   // '?'
    {
      try_Expression1Rest();
    }
  }

  void parse_Expression1Rest()
  {
    eventHandler->startNonterminal(L"Expression1Rest", e0);
    consume(48);                    // '?'
    lookahead1W(95);                // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
    whitespace();
    parse_Expression();
    consume(34);                    // ':'
    lookahead1W(95);                // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
    whitespace();
    parse_Expression1();
    eventHandler->endNonterminal(L"Expression1Rest", e0);
  }

  void try_Expression1Rest()
  {
    consumeT(48);                   // '?'
    lookahead1W(95);                // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
    try_Expression();
    consumeT(34);                   // ':'
    lookahead1W(95);                // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
    try_Expression1();
  }

  void parse_Expression2()
  {
    eventHandler->startNonterminal(L"Expression2", e0);
    parse_Expression4();
    for (;;)
    {
      if (l1 != 13                  // '!='
       && l1 != 17                  // '&&'
       && l1 != 41                  // '=='
       && l1 != 77                  // 'instanceof'
       && l1 != 105)                // '||'
      {
        break;
      }
      switch (l1)
      {
      case 77:                      // 'instanceof'
        consume(77);                // 'instanceof'
        lookahead1W(78);            // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
        whitespace();
        parse_Type();
        break;
      default:
        whitespace();
        parse_InfixOp2();
        lookahead1W(95);            // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
        whitespace();
        parse_Expression4();
        break;
      }
    }
    eventHandler->endNonterminal(L"Expression2", e0);
  }

  void try_Expression2()
  {
    try_Expression4();
    for (;;)
    {
      if (l1 != 13                  // '!='
       && l1 != 17                  // '&&'
       && l1 != 41                  // '=='
       && l1 != 77                  // 'instanceof'
       && l1 != 105)                // '||'
      {
        break;
      }
      switch (l1)
      {
      case 77:                      // 'instanceof'
        consumeT(77);               // 'instanceof'
        lookahead1W(78);            // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
        try_Type();
        break;
      default:
        try_InfixOp2();
        lookahead1W(95);            // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
        try_Expression4();
        break;
      }
    }
  }

  void parse_Expression4()
  {
    eventHandler->startNonterminal(L"Expression4", e0);
    parse_Expression3();
    for (;;)
    {
      if (l1 != 14                  // '%'
       && l1 != 16                  // '&'
       && l1 != 21                  // '*'
       && l1 != 23                  // '+'
       && l1 != 27                  // '-'
       && l1 != 32                  // '/'
       && l1 != 36                  // '<'
       && l1 != 37                  // '<<'
       && l1 != 39                  // '<='
       && l1 != 42                  // '>'
       && l1 != 43                  // '>='
       && l1 != 44                  // '>>'
       && l1 != 46                  // '>>>'
       && l1 != 52                  // '^'
       && l1 != 103)                // '|'
      {
        break;
      }
      whitespace();
      parse_InfixOp();
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      whitespace();
      parse_Expression3();
    }
    eventHandler->endNonterminal(L"Expression4", e0);
  }

  void try_Expression4()
  {
    try_Expression3();
    for (;;)
    {
      if (l1 != 14                  // '%'
       && l1 != 16                  // '&'
       && l1 != 21                  // '*'
       && l1 != 23                  // '+'
       && l1 != 27                  // '-'
       && l1 != 32                  // '/'
       && l1 != 36                  // '<'
       && l1 != 37                  // '<<'
       && l1 != 39                  // '<='
       && l1 != 42                  // '>'
       && l1 != 43                  // '>='
       && l1 != 44                  // '>>'
       && l1 != 46                  // '>>>'
       && l1 != 52                  // '^'
       && l1 != 103)                // '|'
      {
        break;
      }
      try_InfixOp();
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      try_Expression3();
    }
  }

  void parse_InfixOp2()
  {
    eventHandler->startNonterminal(L"InfixOp2", e0);
    switch (l1)
    {
    case 105:                       // '||'
      consume(105);                 // '||'
      break;
    case 17:                        // '&&'
      consume(17);                  // '&&'
      break;
    case 41:                        // '=='
      consume(41);                  // '=='
      break;
    default:
      consume(13);                  // '!='
      break;
    }
    eventHandler->endNonterminal(L"InfixOp2", e0);
  }

  void try_InfixOp2()
  {
    switch (l1)
    {
    case 105:                       // '||'
      consumeT(105);                // '||'
      break;
    case 17:                        // '&&'
      consumeT(17);                 // '&&'
      break;
    case 41:                        // '=='
      consumeT(41);                 // '=='
      break;
    default:
      consumeT(13);                 // '!='
      break;
    }
  }

  void parse_InfixOp()
  {
    eventHandler->startNonterminal(L"InfixOp", e0);
    switch (l1)
    {
    case 103:                       // '|'
      consume(103);                 // '|'
      break;
    case 52:                        // '^'
      consume(52);                  // '^'
      break;
    case 16:                        // '&'
      consume(16);                  // '&'
      break;
    case 36:                        // '<'
      consume(36);                  // '<'
      break;
    case 42:                        // '>'
      consume(42);                  // '>'
      break;
    case 39:                        // '<='
      consume(39);                  // '<='
      break;
    case 43:                        // '>='
      consume(43);                  // '>='
      break;
    case 37:                        // '<<'
      consume(37);                  // '<<'
      break;
    case 44:                        // '>>'
      consume(44);                  // '>>'
      break;
    case 46:                        // '>>>'
      consume(46);                  // '>>>'
      break;
    case 23:                        // '+'
      consume(23);                  // '+'
      break;
    case 27:                        // '-'
      consume(27);                  // '-'
      break;
    case 21:                        // '*'
      consume(21);                  // '*'
      break;
    case 32:                        // '/'
      consume(32);                  // '/'
      break;
    default:
      consume(14);                  // '%'
      break;
    }
    eventHandler->endNonterminal(L"InfixOp", e0);
  }

  void try_InfixOp()
  {
    switch (l1)
    {
    case 103:                       // '|'
      consumeT(103);                // '|'
      break;
    case 52:                        // '^'
      consumeT(52);                 // '^'
      break;
    case 16:                        // '&'
      consumeT(16);                 // '&'
      break;
    case 36:                        // '<'
      consumeT(36);                 // '<'
      break;
    case 42:                        // '>'
      consumeT(42);                 // '>'
      break;
    case 39:                        // '<='
      consumeT(39);                 // '<='
      break;
    case 43:                        // '>='
      consumeT(43);                 // '>='
      break;
    case 37:                        // '<<'
      consumeT(37);                 // '<<'
      break;
    case 44:                        // '>>'
      consumeT(44);                 // '>>'
      break;
    case 46:                        // '>>>'
      consumeT(46);                 // '>>>'
      break;
    case 23:                        // '+'
      consumeT(23);                 // '+'
      break;
    case 27:                        // '-'
      consumeT(27);                 // '-'
      break;
    case 21:                        // '*'
      consumeT(21);                 // '*'
      break;
    case 32:                        // '/'
      consumeT(32);                 // '/'
      break;
    default:
      consumeT(14);                 // '%'
      break;
    }
  }

  void parse_Expression3()
  {
    eventHandler->startNonterminal(L"Expression3", e0);
    switch (l1)
    {
    case 19:                        // '('
      lookahead2W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      break;
    default:
      lk = l1;
      break;
    }
    if (lk == 531                   // '(' Identifier
     || lk == 7187                  // '(' 'boolean'
     || lk == 7443                  // '(' 'byte'
     || lk == 7827                  // '(' 'char'
     || lk == 8467                  // '(' 'double'
     || lk == 9235                  // '(' 'float'
     || lk == 10003                 // '(' 'int'
     || lk == 10259                 // '(' 'long'
     || lk == 11283)                // '(' 'short'
    {
      lk = memoized(8, e0);
      if (lk == 0)
      {
        int b0A = b0; int e0A = e0; int l1A = l1;
        int b1A = b1; int e1A = e1; int l2A = l2;
        int b2A = b2; int e2A = e2;
        try
        {
          try_CastExpression();
          lk = -2;
        }
        catch (ParseException &)
        {
          lk = -3;
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
        b2 = b2A; e2 = e2A; end = e2A; }}
        memoize(8, e0, lk);
      }
    }
    switch (lk)
    {
    case 12:                        // '!'
    case 23:                        // '+'
    case 24:                        // '++'
    case 27:                        // '-'
    case 28:                        // '--'
    case 107:                       // '~'
      parse_PrefixOp();
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      whitespace();
      parse_Expression3();
      break;
    case -2:
      parse_CastExpression();
      break;
    default:
      parse_Primary();
      for (;;)
      {
        lookahead1W(122);           // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' |
                                    // '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||' | '}'
        if (l1 != 30                // '.'
         && l1 != 50)               // '['
        {
          break;
        }
        whitespace();
        parse_Selector();
      }
      for (;;)
      {
        lookahead1W(120);           // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' | ';' | '<' |
                                    // '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' | '>>>=' |
                                    // '?' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||' | '}'
        if (l1 != 24                // '++'
         && l1 != 28)               // '--'
        {
          break;
        }
        whitespace();
        parse_PostfixOp();
      }
      break;
    }
    eventHandler->endNonterminal(L"Expression3", e0);
  }

  void try_Expression3()
  {
    switch (l1)
    {
    case 19:                        // '('
      lookahead2W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      break;
    default:
      lk = l1;
      break;
    }
    if (lk == 531                   // '(' Identifier
     || lk == 7187                  // '(' 'boolean'
     || lk == 7443                  // '(' 'byte'
     || lk == 7827                  // '(' 'char'
     || lk == 8467                  // '(' 'double'
     || lk == 9235                  // '(' 'float'
     || lk == 10003                 // '(' 'int'
     || lk == 10259                 // '(' 'long'
     || lk == 11283)                // '(' 'short'
    {
      lk = memoized(8, e0);
      if (lk == 0)
      {
        int b0A = b0; int e0A = e0; int l1A = l1;
        int b1A = b1; int e1A = e1; int l2A = l2;
        int b2A = b2; int e2A = e2;
        try
        {
          try_CastExpression();
          memoize(8, e0A, -2);
          lk = -4;
        }
        catch (ParseException &)
        {
          lk = -3;
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; end = e2A; }}
          memoize(8, e0A, -3);
        }
      }
    }
    switch (lk)
    {
    case 12:                        // '!'
    case 23:                        // '+'
    case 24:                        // '++'
    case 27:                        // '-'
    case 28:                        // '--'
    case 107:                       // '~'
      try_PrefixOp();
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      try_Expression3();
      break;
    case -2:
      try_CastExpression();
      break;
    case -4:
      break;
    default:
      try_Primary();
      for (;;)
      {
        lookahead1W(122);           // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' |
                                    // '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||' | '}'
        if (l1 != 30                // '.'
         && l1 != 50)               // '['
        {
          break;
        }
        try_Selector();
      }
      for (;;)
      {
        lookahead1W(120);           // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '/' | '/=' | ':' | ';' | '<' |
                                    // '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' | '>>>=' |
                                    // '?' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||' | '}'
        if (l1 != 24                // '++'
         && l1 != 28)               // '--'
        {
          break;
        }
        try_PostfixOp();
      }
      break;
    }
  }

  void parse_CastExpression()
  {
    eventHandler->startNonterminal(L"CastExpression", e0);
    switch (l1)
    {
    case 19:                        // '('
      lookahead2W(78);              // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 531:                       // '(' Identifier
      consume(19);                  // '('
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_ReferenceType();
      for (;;)
      {
        lookahead1W(32);            // WhiteSpace | Comment | ')' | '['
        if (l1 != 50)               // '['
        {
          break;
        }
        consume(50);                // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consume(51);                // ']'
      }
      consume(20);                  // ')'
      lookahead1W(91);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '(' | '<' |
                                    // 'boolean' | 'byte' | 'char' | 'double' | 'float' | 'int' | 'long' | 'new' |
                                    // 'short' | 'super' | 'this' | 'void'
      switch (l1)
      {
      case 19:                      // '('
        lookahead2W(95);            // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 531                 // '(' Identifier
       || lk == 7187                // '(' 'boolean'
       || lk == 7443                // '(' 'byte'
       || lk == 7827                // '(' 'char'
       || lk == 8467                // '(' 'double'
       || lk == 9235                // '(' 'float'
       || lk == 10003               // '(' 'int'
       || lk == 10259               // '(' 'long'
       || lk == 11283)              // '(' 'short'
      {
        lk = memoized(9, e0);
        if (lk == 0)
        {
          int b0A = b0; int e0A = e0; int l1A = l1;
          int b1A = b1; int e1A = e1; int l2A = l2;
          int b2A = b2; int e2A = e2;
          try
          {
            try_CastExpression();
            lk = -1;
          }
          catch (ParseException &)
          {
            lk = -2;
          }
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; end = e2A; }}
          memoize(9, e0, lk);
        }
      }
      switch (lk)
      {
      case -1:
        whitespace();
        parse_CastExpression();
        break;
      default:
        whitespace();
        parse_Primary();
        for (;;)
        {
          lookahead1W(121);         // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '+=' | ',' | '-' | '-=' | '.' | '/' | '/=' | ':' | ';' | '<' | '<<' |
                                    // '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' | '>>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||' | '}'
          if (l1 != 30              // '.'
           && l1 != 50)             // '['
          {
            break;
          }
          whitespace();
          parse_Selector();
        }
        break;
      }
      break;
    default:
      consume(19);                  // '('
      lookahead1W(77);              // WhiteSpace | Comment | 'boolean' | 'byte' | 'char' | 'double' | 'float' | 'int' |
                                    // 'long' | 'short'
      whitespace();
      parse_BasicType();
      for (;;)
      {
        lookahead1W(32);            // WhiteSpace | Comment | ')' | '['
        if (l1 != 50)               // '['
        {
          break;
        }
        consume(50);                // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consume(51);                // ']'
      }
      consume(20);                  // ')'
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      whitespace();
      parse_Expression3();
      break;
    }
    eventHandler->endNonterminal(L"CastExpression", e0);
  }

  void try_CastExpression()
  {
    switch (l1)
    {
    case 19:                        // '('
      lookahead2W(78);              // WhiteSpace | Comment | Identifier | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'short'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 531:                       // '(' Identifier
      consumeT(19);                 // '('
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_ReferenceType();
      for (;;)
      {
        lookahead1W(32);            // WhiteSpace | Comment | ')' | '['
        if (l1 != 50)               // '['
        {
          break;
        }
        consumeT(50);               // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consumeT(51);               // ']'
      }
      consumeT(20);                 // ')'
      lookahead1W(91);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '(' | '<' |
                                    // 'boolean' | 'byte' | 'char' | 'double' | 'float' | 'int' | 'long' | 'new' |
                                    // 'short' | 'super' | 'this' | 'void'
      switch (l1)
      {
      case 19:                      // '('
        lookahead2W(95);            // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 531                 // '(' Identifier
       || lk == 7187                // '(' 'boolean'
       || lk == 7443                // '(' 'byte'
       || lk == 7827                // '(' 'char'
       || lk == 8467                // '(' 'double'
       || lk == 9235                // '(' 'float'
       || lk == 10003               // '(' 'int'
       || lk == 10259               // '(' 'long'
       || lk == 11283)              // '(' 'short'
      {
        lk = memoized(9, e0);
        if (lk == 0)
        {
          int b0A = b0; int e0A = e0; int l1A = l1;
          int b1A = b1; int e1A = e1; int l2A = l2;
          int b2A = b2; int e2A = e2;
          try
          {
            try_CastExpression();
            memoize(9, e0A, -1);
            lk = -3;
          }
          catch (ParseException &)
          {
            lk = -2;
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; end = e2A; }}
            memoize(9, e0A, -2);
          }
        }
      }
      switch (lk)
      {
      case -1:
        try_CastExpression();
        break;
      case -3:
        break;
      default:
        try_Primary();
        for (;;)
        {
          lookahead1W(121);         // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '+=' | ',' | '-' | '-=' | '.' | '/' | '/=' | ':' | ';' | '<' | '<<' |
                                    // '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' | '>>>=' | '?' |
                                    // '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||' | '}'
          if (l1 != 30              // '.'
           && l1 != 50)             // '['
          {
            break;
          }
          try_Selector();
        }
        break;
      }
      break;
    default:
      consumeT(19);                 // '('
      lookahead1W(77);              // WhiteSpace | Comment | 'boolean' | 'byte' | 'char' | 'double' | 'float' | 'int' |
                                    // 'long' | 'short'
      try_BasicType();
      for (;;)
      {
        lookahead1W(32);            // WhiteSpace | Comment | ')' | '['
        if (l1 != 50)               // '['
        {
          break;
        }
        consumeT(50);               // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consumeT(51);               // ']'
      }
      consumeT(20);                 // ')'
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      try_Expression3();
      break;
    }
  }

  void parse_PrefixOp()
  {
    eventHandler->startNonterminal(L"PrefixOp", e0);
    switch (l1)
    {
    case 24:                        // '++'
      consume(24);                  // '++'
      break;
    case 28:                        // '--'
      consume(28);                  // '--'
      break;
    case 12:                        // '!'
      consume(12);                  // '!'
      break;
    case 107:                       // '~'
      consume(107);                 // '~'
      break;
    case 23:                        // '+'
      consume(23);                  // '+'
      break;
    default:
      consume(27);                  // '-'
      break;
    }
    eventHandler->endNonterminal(L"PrefixOp", e0);
  }

  void try_PrefixOp()
  {
    switch (l1)
    {
    case 24:                        // '++'
      consumeT(24);                 // '++'
      break;
    case 28:                        // '--'
      consumeT(28);                 // '--'
      break;
    case 12:                        // '!'
      consumeT(12);                 // '!'
      break;
    case 107:                       // '~'
      consumeT(107);                // '~'
      break;
    case 23:                        // '+'
      consumeT(23);                 // '+'
      break;
    default:
      consumeT(27);                 // '-'
      break;
    }
  }

  void parse_PostfixOp()
  {
    eventHandler->startNonterminal(L"PostfixOp", e0);
    switch (l1)
    {
    case 24:                        // '++'
      consume(24);                  // '++'
      break;
    default:
      consume(28);                  // '--'
      break;
    }
    eventHandler->endNonterminal(L"PostfixOp", e0);
  }

  void try_PostfixOp()
  {
    switch (l1)
    {
    case 24:                        // '++'
      consumeT(24);                 // '++'
      break;
    default:
      consumeT(28);                 // '--'
      break;
    }
  }

  void parse_Primary()
  {
    eventHandler->startNonterminal(L"Primary", e0);
    switch (l1)
    {
    case 5:                         // IntegerLiteral
    case 6:                         // FloatingPointLiteral
    case 7:                         // BooleanLiteral
    case 8:                         // CharacterLiteral
    case 9:                         // StringLiteral
    case 10:                        // NullLiteral
      parse_Literal();
      break;
    case 19:                        // '('
      parse_ParExpression();
      break;
    case 94:                        // 'this'
      consume(94);                  // 'this'
      lookahead1W(123);             // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '>>>' | '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' |
                                    // '||' | '}'
      if (l1 == 19)                 // '('
      {
        whitespace();
        parse_Arguments();
      }
      break;
    case 91:                        // 'super'
      consume(91);                  // 'super'
      lookahead1W(28);              // WhiteSpace | Comment | '(' | '.'
      whitespace();
      parse_SuperSuffix();
      break;
    case 82:                        // 'new'
      consume(82);                  // 'new'
      lookahead1W(79);              // WhiteSpace | Comment | Identifier | '<' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'short'
      whitespace();
      parse_Creator();
      break;
    case 36:                        // '<'
      parse_NonWildcardTypeArguments();
      lookahead1W(49);              // WhiteSpace | Comment | Identifier | 'super' | 'this'
      switch (l1)
      {
      case 94:                      // 'this'
        consume(94);                // 'this'
        lookahead1W(2);             // WhiteSpace | Comment | '('
        whitespace();
        parse_Arguments();
        break;
      default:
        whitespace();
        parse_ExplicitGenericInvocationSuffix();
        break;
      }
      break;
    case 4:                         // Identifier
      consume(4);                   // Identifier
      for (;;)
      {
        lookahead1W(123);           // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '>>>' | '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' |
                                    // '||' | '}'
        switch (l1)
        {
        case 30:                    // '.'
          lookahead2W(75);          // WhiteSpace | Comment | Identifier | '<' | 'class' | 'new' | 'super' | 'this'
          break;
        default:
          lk = l1;
          break;
        }
        if (lk == 542)              // '.' Identifier
        {
          lk = memoized(10, e0);
          if (lk == 0)
          {
            int b0A = b0; int e0A = e0; int l1A = l1;
            int b1A = b1; int e1A = e1; int l2A = l2;
            int b2A = b2; int e2A = e2;
            try
            {
              consumeT(30);         // '.'
              lookahead1W(0);       // WhiteSpace | Comment | Identifier
              consumeT(4);          // Identifier
              lk = -1;
            }
            catch (ParseException &)
            {
              lk = -2;
            }
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; end = e2A; }}
            memoize(10, e0, lk);
          }
        }
        if (lk != -1)
        {
          break;
        }
        consume(30);                // '.'
        lookahead1W(0);             // WhiteSpace | Comment | Identifier
        consume(4);                 // Identifier
      }
      switch (l1)
      {
      case 30:                      // '.'
        lookahead2W(75);            // WhiteSpace | Comment | Identifier | '<' | 'class' | 'new' | 'super' | 'this'
        break;
      case 50:                      // '['
        lookahead2W(108);           // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '.' | '<' | '[' | ']' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' |
                                    // 'void' | '~'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 562                 // '[' Identifier
       || lk == 690                 // '[' IntegerLiteral
       || lk == 818                 // '[' FloatingPointLiteral
       || lk == 946                 // '[' BooleanLiteral
       || lk == 1074                // '[' CharacterLiteral
       || lk == 1202                // '[' StringLiteral
       || lk == 1330                // '[' NullLiteral
       || lk == 1586                // '[' '!'
       || lk == 2482                // '[' '('
       || lk == 2994                // '[' '+'
       || lk == 3122                // '[' '++'
       || lk == 3506                // '[' '-'
       || lk == 3634                // '[' '--'
       || lk == 4638                // '.' '<'
       || lk == 4658                // '[' '<'
       || lk == 7218                // '[' 'boolean'
       || lk == 7474                // '[' 'byte'
       || lk == 7858                // '[' 'char'
       || lk == 8498                // '[' 'double'
       || lk == 9266                // '[' 'float'
       || lk == 10034               // '[' 'int'
       || lk == 10290               // '[' 'long'
       || lk == 10526               // '.' 'new'
       || lk == 10546               // '[' 'new'
       || lk == 11314               // '[' 'short'
       || lk == 11678               // '.' 'super'
       || lk == 11698               // '[' 'super'
       || lk == 12062               // '.' 'this'
       || lk == 12082               // '[' 'this'
       || lk == 12722               // '[' 'void'
       || lk == 13746)              // '[' '~'
      {
        lk = memoized(11, e0);
        if (lk == 0)
        {
          int b0A = b0; int e0A = e0; int l1A = l1;
          int b1A = b1; int e1A = e1; int l2A = l2;
          int b2A = b2; int e2A = e2;
          try
          {
            try_IdentifierSuffix();
            lk = -1;
          }
          catch (ParseException &)
          {
            lk = -2;
          }
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; end = e2A; }}
          memoize(11, e0, lk);
        }
      }
      if (lk == -1
       || lk == 19                  // '('
       || lk == 3890                // '[' '.'
       || lk == 6450                // '[' '['
       || lk == 6578                // '[' ']'
       || lk == 7966)               // '.' 'class'
      {
        whitespace();
        parse_IdentifierSuffix();
      }
      break;
    case 99:                        // 'void'
      consume(99);                  // 'void'
      lookahead1W(5);               // WhiteSpace | Comment | '.'
      consume(30);                  // '.'
      lookahead1W(13);              // WhiteSpace | Comment | 'class'
      consume(62);                  // 'class'
      break;
    default:
      parse_BasicType();
      for (;;)
      {
        lookahead1W(36);            // WhiteSpace | Comment | '.' | '['
        if (l1 != 50)               // '['
        {
          break;
        }
        consume(50);                // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consume(51);                // ']'
      }
      consume(30);                  // '.'
      lookahead1W(13);              // WhiteSpace | Comment | 'class'
      consume(62);                  // 'class'
      break;
    }
    eventHandler->endNonterminal(L"Primary", e0);
  }

  void try_Primary()
  {
    switch (l1)
    {
    case 5:                         // IntegerLiteral
    case 6:                         // FloatingPointLiteral
    case 7:                         // BooleanLiteral
    case 8:                         // CharacterLiteral
    case 9:                         // StringLiteral
    case 10:                        // NullLiteral
      try_Literal();
      break;
    case 19:                        // '('
      try_ParExpression();
      break;
    case 94:                        // 'this'
      consumeT(94);                 // 'this'
      lookahead1W(123);             // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '>>>' | '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' |
                                    // '||' | '}'
      if (l1 == 19)                 // '('
      {
        try_Arguments();
      }
      break;
    case 91:                        // 'super'
      consumeT(91);                 // 'super'
      lookahead1W(28);              // WhiteSpace | Comment | '(' | '.'
      try_SuperSuffix();
      break;
    case 82:                        // 'new'
      consumeT(82);                 // 'new'
      lookahead1W(79);              // WhiteSpace | Comment | Identifier | '<' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'short'
      try_Creator();
      break;
    case 36:                        // '<'
      try_NonWildcardTypeArguments();
      lookahead1W(49);              // WhiteSpace | Comment | Identifier | 'super' | 'this'
      switch (l1)
      {
      case 94:                      // 'this'
        consumeT(94);               // 'this'
        lookahead1W(2);             // WhiteSpace | Comment | '('
        try_Arguments();
        break;
      default:
        try_ExplicitGenericInvocationSuffix();
        break;
      }
      break;
    case 4:                         // Identifier
      consumeT(4);                  // Identifier
      for (;;)
      {
        lookahead1W(123);           // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '>>>' | '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' |
                                    // '||' | '}'
        switch (l1)
        {
        case 30:                    // '.'
          lookahead2W(75);          // WhiteSpace | Comment | Identifier | '<' | 'class' | 'new' | 'super' | 'this'
          break;
        default:
          lk = l1;
          break;
        }
        if (lk == 542)              // '.' Identifier
        {
          lk = memoized(10, e0);
          if (lk == 0)
          {
            int b0A = b0; int e0A = e0; int l1A = l1;
            int b1A = b1; int e1A = e1; int l2A = l2;
            int b2A = b2; int e2A = e2;
            try
            {
              consumeT(30);         // '.'
              lookahead1W(0);       // WhiteSpace | Comment | Identifier
              consumeT(4);          // Identifier
              memoize(10, e0A, -1);
              continue;
            }
            catch (ParseException &)
            {
              b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
              b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
              b2 = b2A; e2 = e2A; end = e2A; }}
              memoize(10, e0A, -2);
              break;
            }
          }
        }
        if (lk != -1)
        {
          break;
        }
        consumeT(30);               // '.'
        lookahead1W(0);             // WhiteSpace | Comment | Identifier
        consumeT(4);                // Identifier
      }
      switch (l1)
      {
      case 30:                      // '.'
        lookahead2W(75);            // WhiteSpace | Comment | Identifier | '<' | 'class' | 'new' | 'super' | 'this'
        break;
      case 50:                      // '['
        lookahead2W(108);           // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '.' | '<' | '[' | ']' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' |
                                    // 'void' | '~'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk == 562                 // '[' Identifier
       || lk == 690                 // '[' IntegerLiteral
       || lk == 818                 // '[' FloatingPointLiteral
       || lk == 946                 // '[' BooleanLiteral
       || lk == 1074                // '[' CharacterLiteral
       || lk == 1202                // '[' StringLiteral
       || lk == 1330                // '[' NullLiteral
       || lk == 1586                // '[' '!'
       || lk == 2482                // '[' '('
       || lk == 2994                // '[' '+'
       || lk == 3122                // '[' '++'
       || lk == 3506                // '[' '-'
       || lk == 3634                // '[' '--'
       || lk == 4638                // '.' '<'
       || lk == 4658                // '[' '<'
       || lk == 7218                // '[' 'boolean'
       || lk == 7474                // '[' 'byte'
       || lk == 7858                // '[' 'char'
       || lk == 8498                // '[' 'double'
       || lk == 9266                // '[' 'float'
       || lk == 10034               // '[' 'int'
       || lk == 10290               // '[' 'long'
       || lk == 10526               // '.' 'new'
       || lk == 10546               // '[' 'new'
       || lk == 11314               // '[' 'short'
       || lk == 11678               // '.' 'super'
       || lk == 11698               // '[' 'super'
       || lk == 12062               // '.' 'this'
       || lk == 12082               // '[' 'this'
       || lk == 12722               // '[' 'void'
       || lk == 13746)              // '[' '~'
      {
        lk = memoized(11, e0);
        if (lk == 0)
        {
          int b0A = b0; int e0A = e0; int l1A = l1;
          int b1A = b1; int e1A = e1; int l2A = l2;
          int b2A = b2; int e2A = e2;
          try
          {
            try_IdentifierSuffix();
            memoize(11, e0A, -1);
          }
          catch (ParseException &)
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; end = e2A; }}
            memoize(11, e0A, -2);
          }
          lk = -2;
        }
      }
      if (lk == -1
       || lk == 19                  // '('
       || lk == 3890                // '[' '.'
       || lk == 6450                // '[' '['
       || lk == 6578                // '[' ']'
       || lk == 7966)               // '.' 'class'
      {
        try_IdentifierSuffix();
      }
      break;
    case 99:                        // 'void'
      consumeT(99);                 // 'void'
      lookahead1W(5);               // WhiteSpace | Comment | '.'
      consumeT(30);                 // '.'
      lookahead1W(13);              // WhiteSpace | Comment | 'class'
      consumeT(62);                 // 'class'
      break;
    default:
      try_BasicType();
      for (;;)
      {
        lookahead1W(36);            // WhiteSpace | Comment | '.' | '['
        if (l1 != 50)               // '['
        {
          break;
        }
        consumeT(50);               // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consumeT(51);               // ']'
      }
      consumeT(30);                 // '.'
      lookahead1W(13);              // WhiteSpace | Comment | 'class'
      consumeT(62);                 // 'class'
      break;
    }
  }

  void parse_Literal()
  {
    eventHandler->startNonterminal(L"Literal", e0);
    switch (l1)
    {
    case 5:                         // IntegerLiteral
      consume(5);                   // IntegerLiteral
      break;
    case 6:                         // FloatingPointLiteral
      consume(6);                   // FloatingPointLiteral
      break;
    case 8:                         // CharacterLiteral
      consume(8);                   // CharacterLiteral
      break;
    case 9:                         // StringLiteral
      consume(9);                   // StringLiteral
      break;
    case 7:                         // BooleanLiteral
      consume(7);                   // BooleanLiteral
      break;
    default:
      consume(10);                  // NullLiteral
      break;
    }
    eventHandler->endNonterminal(L"Literal", e0);
  }

  void try_Literal()
  {
    switch (l1)
    {
    case 5:                         // IntegerLiteral
      consumeT(5);                  // IntegerLiteral
      break;
    case 6:                         // FloatingPointLiteral
      consumeT(6);                  // FloatingPointLiteral
      break;
    case 8:                         // CharacterLiteral
      consumeT(8);                  // CharacterLiteral
      break;
    case 9:                         // StringLiteral
      consumeT(9);                  // StringLiteral
      break;
    case 7:                         // BooleanLiteral
      consumeT(7);                  // BooleanLiteral
      break;
    default:
      consumeT(10);                 // NullLiteral
      break;
    }
  }

  void parse_ParExpression()
  {
    eventHandler->startNonterminal(L"ParExpression", e0);
    consume(19);                    // '('
    lookahead1W(95);                // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
    whitespace();
    parse_Expression();
    consume(20);                    // ')'
    eventHandler->endNonterminal(L"ParExpression", e0);
  }

  void try_ParExpression()
  {
    consumeT(19);                   // '('
    lookahead1W(95);                // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
    try_Expression();
    consumeT(20);                   // ')'
  }

  void parse_Arguments()
  {
    eventHandler->startNonterminal(L"Arguments", e0);
    consume(19);                    // '('
    lookahead1W(97);                // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // ')' | '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
    if (l1 != 20)                   // ')'
    {
      whitespace();
      parse_Expression();
      for (;;)
      {
        if (l1 != 26)               // ','
        {
          break;
        }
        consume(26);                // ','
        lookahead1W(95);            // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
        whitespace();
        parse_Expression();
      }
    }
    consume(20);                    // ')'
    eventHandler->endNonterminal(L"Arguments", e0);
  }

  void try_Arguments()
  {
    consumeT(19);                   // '('
    lookahead1W(97);                // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // ')' | '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
    if (l1 != 20)                   // ')'
    {
      try_Expression();
      for (;;)
      {
        if (l1 != 26)               // ','
        {
          break;
        }
        consumeT(26);               // ','
        lookahead1W(95);            // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
        try_Expression();
      }
    }
    consumeT(20);                   // ')'
  }

  void parse_SuperSuffix()
  {
    eventHandler->startNonterminal(L"SuperSuffix", e0);
    switch (l1)
    {
    case 19:                        // '('
      parse_Arguments();
      break;
    default:
      consume(30);                  // '.'
      lookahead1W(23);              // WhiteSpace | Comment | Identifier | '<'
      if (l1 == 36)                 // '<'
      {
        whitespace();
        parse_TypeArguments();
      }
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consume(4);                   // Identifier
      lookahead1W(123);             // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '>>>' | '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' |
                                    // '||' | '}'
      if (l1 == 19)                 // '('
      {
        whitespace();
        parse_Arguments();
      }
      break;
    }
    eventHandler->endNonterminal(L"SuperSuffix", e0);
  }

  void try_SuperSuffix()
  {
    switch (l1)
    {
    case 19:                        // '('
      try_Arguments();
      break;
    default:
      consumeT(30);                 // '.'
      lookahead1W(23);              // WhiteSpace | Comment | Identifier | '<'
      if (l1 == 36)                 // '<'
      {
        try_TypeArguments();
      }
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consumeT(4);                  // Identifier
      lookahead1W(123);             // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '>>>' | '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' |
                                    // '||' | '}'
      if (l1 == 19)                 // '('
      {
        try_Arguments();
      }
      break;
    }
  }

  void parse_ExplicitGenericInvocationSuffix()
  {
    eventHandler->startNonterminal(L"ExplicitGenericInvocationSuffix", e0);
    switch (l1)
    {
    case 91:                        // 'super'
      consume(91);                  // 'super'
      lookahead1W(28);              // WhiteSpace | Comment | '(' | '.'
      whitespace();
      parse_SuperSuffix();
      break;
    default:
      consume(4);                   // Identifier
      lookahead1W(2);               // WhiteSpace | Comment | '('
      whitespace();
      parse_Arguments();
      break;
    }
    eventHandler->endNonterminal(L"ExplicitGenericInvocationSuffix", e0);
  }

  void try_ExplicitGenericInvocationSuffix()
  {
    switch (l1)
    {
    case 91:                        // 'super'
      consumeT(91);                 // 'super'
      lookahead1W(28);              // WhiteSpace | Comment | '(' | '.'
      try_SuperSuffix();
      break;
    default:
      consumeT(4);                  // Identifier
      lookahead1W(2);               // WhiteSpace | Comment | '('
      try_Arguments();
      break;
    }
  }

  void parse_Creator()
  {
    eventHandler->startNonterminal(L"Creator", e0);
    switch (l1)
    {
    case 36:                        // '<'
      parse_NonWildcardTypeArguments();
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_CreatedName();
      whitespace();
      parse_ClassCreatorRest();
      break;
    case 4:                         // Identifier
      parse_CreatedName();
      switch (l1)
      {
      case 19:                      // '('
        whitespace();
        parse_ClassCreatorRest();
        break;
      default:
        whitespace();
        parse_ArrayCreatorRest();
        break;
      }
      break;
    default:
      parse_BasicType();
      lookahead1W(11);              // WhiteSpace | Comment | '['
      whitespace();
      parse_ArrayCreatorRest();
      break;
    }
    eventHandler->endNonterminal(L"Creator", e0);
  }

  void try_Creator()
  {
    switch (l1)
    {
    case 36:                        // '<'
      try_NonWildcardTypeArguments();
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_CreatedName();
      try_ClassCreatorRest();
      break;
    case 4:                         // Identifier
      try_CreatedName();
      switch (l1)
      {
      case 19:                      // '('
        try_ClassCreatorRest();
        break;
      default:
        try_ArrayCreatorRest();
        break;
      }
      break;
    default:
      try_BasicType();
      lookahead1W(11);              // WhiteSpace | Comment | '['
      try_ArrayCreatorRest();
      break;
    }
  }

  void parse_CreatedName()
  {
    eventHandler->startNonterminal(L"CreatedName", e0);
    consume(4);                     // Identifier
    lookahead1W(62);                // WhiteSpace | Comment | '(' | '.' | '<' | '['
    if (l1 == 36)                   // '<'
    {
      whitespace();
      parse_TypeArgumentsOrDiamond();
    }
    for (;;)
    {
      lookahead1W(50);              // WhiteSpace | Comment | '(' | '.' | '['
      if (l1 != 30)                 // '.'
      {
        break;
      }
      consume(30);                  // '.'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consume(4);                   // Identifier
      lookahead1W(62);              // WhiteSpace | Comment | '(' | '.' | '<' | '['
      if (l1 == 36)                 // '<'
      {
        whitespace();
        parse_TypeArgumentsOrDiamond();
      }
    }
    eventHandler->endNonterminal(L"CreatedName", e0);
  }

  void try_CreatedName()
  {
    consumeT(4);                    // Identifier
    lookahead1W(62);                // WhiteSpace | Comment | '(' | '.' | '<' | '['
    if (l1 == 36)                   // '<'
    {
      try_TypeArgumentsOrDiamond();
    }
    for (;;)
    {
      lookahead1W(50);              // WhiteSpace | Comment | '(' | '.' | '['
      if (l1 != 30)                 // '.'
      {
        break;
      }
      consumeT(30);                 // '.'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consumeT(4);                  // Identifier
      lookahead1W(62);              // WhiteSpace | Comment | '(' | '.' | '<' | '['
      if (l1 == 36)                 // '<'
      {
        try_TypeArgumentsOrDiamond();
      }
    }
  }

  void parse_ClassCreatorRest()
  {
    eventHandler->startNonterminal(L"ClassCreatorRest", e0);
    parse_Arguments();
    lookahead1W(124);               // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' |
                                    // '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '{' | '|' | '|=' | '||' |
                                    // '}'
    if (l1 == 102)                  // '{'
    {
      whitespace();
      parse_ClassBody();
    }
    eventHandler->endNonterminal(L"ClassCreatorRest", e0);
  }

  void try_ClassCreatorRest()
  {
    try_Arguments();
    lookahead1W(124);               // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' |
                                    // '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '{' | '|' | '|=' | '||' |
                                    // '}'
    if (l1 == 102)                  // '{'
    {
      try_ClassBody();
    }
  }

  void parse_ArrayCreatorRest()
  {
    eventHandler->startNonterminal(L"ArrayCreatorRest", e0);
    consume(50);                    // '['
    lookahead1W(99);                // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | ']' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
    switch (l1)
    {
    case 51:                        // ']'
      consume(51);                  // ']'
      for (;;)
      {
        lookahead1W(41);            // WhiteSpace | Comment | '[' | '{'
        if (l1 != 50)               // '['
        {
          break;
        }
        consume(50);                // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consume(51);                // ']'
      }
      whitespace();
      parse_ArrayInitializer();
      break;
    default:
      whitespace();
      parse_Expression();
      consume(51);                  // ']'
      for (;;)
      {
        lookahead1W(122);           // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' |
                                    // '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||' | '}'
        switch (l1)
        {
        case 50:                    // '['
          lookahead2W(99);          // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | ']' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
          break;
        default:
          lk = l1;
          break;
        }
        if (lk == 562               // '[' Identifier
         || lk == 690               // '[' IntegerLiteral
         || lk == 818               // '[' FloatingPointLiteral
         || lk == 946               // '[' BooleanLiteral
         || lk == 1074              // '[' CharacterLiteral
         || lk == 1202              // '[' StringLiteral
         || lk == 1330              // '[' NullLiteral
         || lk == 1586              // '[' '!'
         || lk == 2482              // '[' '('
         || lk == 2994              // '[' '+'
         || lk == 3122              // '[' '++'
         || lk == 3506              // '[' '-'
         || lk == 3634              // '[' '--'
         || lk == 4658              // '[' '<'
         || lk == 7218              // '[' 'boolean'
         || lk == 7474              // '[' 'byte'
         || lk == 7858              // '[' 'char'
         || lk == 8498              // '[' 'double'
         || lk == 9266              // '[' 'float'
         || lk == 10034             // '[' 'int'
         || lk == 10290             // '[' 'long'
         || lk == 10546             // '[' 'new'
         || lk == 11314             // '[' 'short'
         || lk == 11698             // '[' 'super'
         || lk == 12082             // '[' 'this'
         || lk == 12722             // '[' 'void'
         || lk == 13746)            // '[' '~'
        {
          lk = memoized(12, e0);
          if (lk == 0)
          {
            int b0A = b0; int e0A = e0; int l1A = l1;
            int b1A = b1; int e1A = e1; int l2A = l2;
            int b2A = b2; int e2A = e2;
            try
            {
              consumeT(50);         // '['
              lookahead1W(95);      // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
              try_Expression();
              consumeT(51);         // ']'
              lk = -1;
            }
            catch (ParseException &)
            {
              lk = -2;
            }
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; end = e2A; }}
            memoize(12, e0, lk);
          }
        }
        if (lk != -1)
        {
          break;
        }
        consume(50);                // '['
        lookahead1W(95);            // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
        whitespace();
        parse_Expression();
        consume(51);                // ']'
      }
      for (;;)
      {
        lookahead1W(122);           // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' |
                                    // '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||' | '}'
        switch (l1)
        {
        case 50:                    // '['
          lookahead2W(99);          // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | ']' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
          break;
        default:
          lk = l1;
          break;
        }
        if (lk != 6578)             // '[' ']'
        {
          break;
        }
        consume(50);                // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consume(51);                // ']'
      }
      break;
    }
    eventHandler->endNonterminal(L"ArrayCreatorRest", e0);
  }

  void try_ArrayCreatorRest()
  {
    consumeT(50);                   // '['
    lookahead1W(99);                // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | ']' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
    switch (l1)
    {
    case 51:                        // ']'
      consumeT(51);                 // ']'
      for (;;)
      {
        lookahead1W(41);            // WhiteSpace | Comment | '[' | '{'
        if (l1 != 50)               // '['
        {
          break;
        }
        consumeT(50);               // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consumeT(51);               // ']'
      }
      try_ArrayInitializer();
      break;
    default:
      try_Expression();
      consumeT(51);                 // ']'
      for (;;)
      {
        lookahead1W(122);           // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' |
                                    // '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||' | '}'
        switch (l1)
        {
        case 50:                    // '['
          lookahead2W(99);          // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | ']' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
          break;
        default:
          lk = l1;
          break;
        }
        if (lk == 562               // '[' Identifier
         || lk == 690               // '[' IntegerLiteral
         || lk == 818               // '[' FloatingPointLiteral
         || lk == 946               // '[' BooleanLiteral
         || lk == 1074              // '[' CharacterLiteral
         || lk == 1202              // '[' StringLiteral
         || lk == 1330              // '[' NullLiteral
         || lk == 1586              // '[' '!'
         || lk == 2482              // '[' '('
         || lk == 2994              // '[' '+'
         || lk == 3122              // '[' '++'
         || lk == 3506              // '[' '-'
         || lk == 3634              // '[' '--'
         || lk == 4658              // '[' '<'
         || lk == 7218              // '[' 'boolean'
         || lk == 7474              // '[' 'byte'
         || lk == 7858              // '[' 'char'
         || lk == 8498              // '[' 'double'
         || lk == 9266              // '[' 'float'
         || lk == 10034             // '[' 'int'
         || lk == 10290             // '[' 'long'
         || lk == 10546             // '[' 'new'
         || lk == 11314             // '[' 'short'
         || lk == 11698             // '[' 'super'
         || lk == 12082             // '[' 'this'
         || lk == 12722             // '[' 'void'
         || lk == 13746)            // '[' '~'
        {
          lk = memoized(12, e0);
          if (lk == 0)
          {
            int b0A = b0; int e0A = e0; int l1A = l1;
            int b1A = b1; int e1A = e1; int l2A = l2;
            int b2A = b2; int e2A = e2;
            try
            {
              consumeT(50);         // '['
              lookahead1W(95);      // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
              try_Expression();
              consumeT(51);         // ']'
              memoize(12, e0A, -1);
              continue;
            }
            catch (ParseException &)
            {
              b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
              b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
              b2 = b2A; e2 = e2A; end = e2A; }}
              memoize(12, e0A, -2);
              break;
            }
          }
        }
        if (lk != -1)
        {
          break;
        }
        consumeT(50);               // '['
        lookahead1W(95);            // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
        try_Expression();
        consumeT(51);               // ']'
      }
      for (;;)
      {
        lookahead1W(122);           // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | ')' | '*' | '*=' |
                                    // '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' | ';' |
                                    // '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' | '>>>' |
                                    // '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' | '||' | '}'
        switch (l1)
        {
        case 50:                    // '['
          lookahead2W(99);          // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | ']' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
          break;
        default:
          lk = l1;
          break;
        }
        if (lk != 6578)             // '[' ']'
        {
          break;
        }
        consumeT(50);               // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consumeT(51);               // ']'
      }
      break;
    }
  }

  void parse_IdentifierSuffix()
  {
    eventHandler->startNonterminal(L"IdentifierSuffix", e0);
    switch (l1)
    {
    case 30:                        // '.'
      lookahead2W(74);              // WhiteSpace | Comment | '<' | 'class' | 'new' | 'super' | 'this'
      break;
    case 50:                        // '['
      lookahead2W(108);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '.' | '<' | '[' | ']' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' |
                                    // 'void' | '~'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 19:                        // '('
      parse_Arguments();
      break;
    case 6578:                      // '[' ']'
    case 7966:                      // '.' 'class'
      for (;;)
      {
        lookahead1W(36);            // WhiteSpace | Comment | '.' | '['
        if (l1 != 50)               // '['
        {
          break;
        }
        consume(50);                // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consume(51);                // ']'
      }
      consume(30);                  // '.'
      lookahead1W(13);              // WhiteSpace | Comment | 'class'
      consume(62);                  // 'class'
      break;
    case 4638:                      // '.' '<'
    case 10526:                     // '.' 'new'
    case 11678:                     // '.' 'super'
    case 12062:                     // '.' 'this'
      consume(30);                  // '.'
      lookahead1W(68);              // WhiteSpace | Comment | '<' | 'new' | 'super' | 'this'
      switch (l1)
      {
      case 36:                      // '<'
        whitespace();
        parse_ExplicitGenericInvocation();
        break;
      case 94:                      // 'this'
        consume(94);                // 'this'
        break;
      case 91:                      // 'super'
        consume(91);                // 'super'
        lookahead1W(2);             // WhiteSpace | Comment | '('
        whitespace();
        parse_Arguments();
        break;
      default:
        consume(82);                // 'new'
        lookahead1W(23);            // WhiteSpace | Comment | Identifier | '<'
        if (l1 == 36)               // '<'
        {
          whitespace();
          parse_NonWildcardTypeArguments();
        }
        lookahead1W(0);             // WhiteSpace | Comment | Identifier
        whitespace();
        parse_InnerCreator();
        break;
      }
      break;
    default:
      consume(50);                  // '['
      lookahead1W(103);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '.' | '<' | '[' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' |
                                    // 'void' | '~'
      switch (l1)
      {
      case 30:                      // '.'
      case 50:                      // '['
        for (;;)
        {
          lookahead1W(36);          // WhiteSpace | Comment | '.' | '['
          if (l1 != 50)             // '['
          {
            break;
          }
          consume(50);              // '['
          lookahead1W(12);          // WhiteSpace | Comment | ']'
          consume(51);              // ']'
        }
        consume(30);                // '.'
        lookahead1W(13);            // WhiteSpace | Comment | 'class'
        consume(62);                // 'class'
        break;
      default:
        whitespace();
        parse_Expression();
        break;
      }
      lookahead1W(12);              // WhiteSpace | Comment | ']'
      consume(51);                  // ']'
      break;
    }
    eventHandler->endNonterminal(L"IdentifierSuffix", e0);
  }

  void try_IdentifierSuffix()
  {
    switch (l1)
    {
    case 30:                        // '.'
      lookahead2W(74);              // WhiteSpace | Comment | '<' | 'class' | 'new' | 'super' | 'this'
      break;
    case 50:                        // '['
      lookahead2W(108);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '.' | '<' | '[' | ']' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' |
                                    // 'void' | '~'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 19:                        // '('
      try_Arguments();
      break;
    case 6578:                      // '[' ']'
    case 7966:                      // '.' 'class'
      for (;;)
      {
        lookahead1W(36);            // WhiteSpace | Comment | '.' | '['
        if (l1 != 50)               // '['
        {
          break;
        }
        consumeT(50);               // '['
        lookahead1W(12);            // WhiteSpace | Comment | ']'
        consumeT(51);               // ']'
      }
      consumeT(30);                 // '.'
      lookahead1W(13);              // WhiteSpace | Comment | 'class'
      consumeT(62);                 // 'class'
      break;
    case 4638:                      // '.' '<'
    case 10526:                     // '.' 'new'
    case 11678:                     // '.' 'super'
    case 12062:                     // '.' 'this'
      consumeT(30);                 // '.'
      lookahead1W(68);              // WhiteSpace | Comment | '<' | 'new' | 'super' | 'this'
      switch (l1)
      {
      case 36:                      // '<'
        try_ExplicitGenericInvocation();
        break;
      case 94:                      // 'this'
        consumeT(94);               // 'this'
        break;
      case 91:                      // 'super'
        consumeT(91);               // 'super'
        lookahead1W(2);             // WhiteSpace | Comment | '('
        try_Arguments();
        break;
      default:
        consumeT(82);               // 'new'
        lookahead1W(23);            // WhiteSpace | Comment | Identifier | '<'
        if (l1 == 36)               // '<'
        {
          try_NonWildcardTypeArguments();
        }
        lookahead1W(0);             // WhiteSpace | Comment | Identifier
        try_InnerCreator();
        break;
      }
      break;
    default:
      consumeT(50);                 // '['
      lookahead1W(103);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '.' | '<' | '[' | 'boolean' | 'byte' | 'char' |
                                    // 'double' | 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' |
                                    // 'void' | '~'
      switch (l1)
      {
      case 30:                      // '.'
      case 50:                      // '['
        for (;;)
        {
          lookahead1W(36);          // WhiteSpace | Comment | '.' | '['
          if (l1 != 50)             // '['
          {
            break;
          }
          consumeT(50);             // '['
          lookahead1W(12);          // WhiteSpace | Comment | ']'
          consumeT(51);             // ']'
        }
        consumeT(30);               // '.'
        lookahead1W(13);            // WhiteSpace | Comment | 'class'
        consumeT(62);               // 'class'
        break;
      default:
        try_Expression();
        break;
      }
      lookahead1W(12);              // WhiteSpace | Comment | ']'
      consumeT(51);                 // ']'
      break;
    }
  }

  void parse_ExplicitGenericInvocation()
  {
    eventHandler->startNonterminal(L"ExplicitGenericInvocation", e0);
    parse_NonWildcardTypeArguments();
    lookahead1W(27);                // WhiteSpace | Comment | Identifier | 'super'
    whitespace();
    parse_ExplicitGenericInvocationSuffix();
    eventHandler->endNonterminal(L"ExplicitGenericInvocation", e0);
  }

  void try_ExplicitGenericInvocation()
  {
    try_NonWildcardTypeArguments();
    lookahead1W(27);                // WhiteSpace | Comment | Identifier | 'super'
    try_ExplicitGenericInvocationSuffix();
  }

  void parse_InnerCreator()
  {
    eventHandler->startNonterminal(L"InnerCreator", e0);
    consume(4);                     // Identifier
    lookahead1W(29);                // WhiteSpace | Comment | '(' | '<'
    if (l1 == 36)                   // '<'
    {
      whitespace();
      parse_NonWildcardTypeArgumentsOrDiamond();
    }
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    whitespace();
    parse_ClassCreatorRest();
    eventHandler->endNonterminal(L"InnerCreator", e0);
  }

  void try_InnerCreator()
  {
    consumeT(4);                    // Identifier
    lookahead1W(29);                // WhiteSpace | Comment | '(' | '<'
    if (l1 == 36)                   // '<'
    {
      try_NonWildcardTypeArgumentsOrDiamond();
    }
    lookahead1W(2);                 // WhiteSpace | Comment | '('
    try_ClassCreatorRest();
  }

  void parse_Selector()
  {
    eventHandler->startNonterminal(L"Selector", e0);
    switch (l1)
    {
    case 30:                        // '.'
      lookahead2W(71);              // WhiteSpace | Comment | Identifier | '<' | 'new' | 'super' | 'this'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 542:                       // '.' Identifier
      consume(30);                  // '.'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consume(4);                   // Identifier
      lookahead1W(123);             // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '>>>' | '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' |
                                    // '||' | '}'
      if (l1 == 19)                 // '('
      {
        whitespace();
        parse_Arguments();
      }
      break;
    case 4638:                      // '.' '<'
      consume(30);                  // '.'
      lookahead1W(8);               // WhiteSpace | Comment | '<'
      whitespace();
      parse_ExplicitGenericInvocation();
      break;
    case 12062:                     // '.' 'this'
      consume(30);                  // '.'
      lookahead1W(17);              // WhiteSpace | Comment | 'this'
      consume(94);                  // 'this'
      break;
    case 11678:                     // '.' 'super'
      consume(30);                  // '.'
      lookahead1W(16);              // WhiteSpace | Comment | 'super'
      consume(91);                  // 'super'
      lookahead1W(28);              // WhiteSpace | Comment | '(' | '.'
      whitespace();
      parse_SuperSuffix();
      break;
    case 10526:                     // '.' 'new'
      consume(30);                  // '.'
      lookahead1W(15);              // WhiteSpace | Comment | 'new'
      consume(82);                  // 'new'
      lookahead1W(23);              // WhiteSpace | Comment | Identifier | '<'
      if (l1 == 36)                 // '<'
      {
        whitespace();
        parse_NonWildcardTypeArguments();
      }
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      whitespace();
      parse_InnerCreator();
      break;
    default:
      consume(50);                  // '['
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      whitespace();
      parse_Expression();
      consume(51);                  // ']'
      break;
    }
    eventHandler->endNonterminal(L"Selector", e0);
  }

  void try_Selector()
  {
    switch (l1)
    {
    case 30:                        // '.'
      lookahead2W(71);              // WhiteSpace | Comment | Identifier | '<' | 'new' | 'super' | 'this'
      break;
    default:
      lk = l1;
      break;
    }
    switch (lk)
    {
    case 542:                       // '.' Identifier
      consumeT(30);                 // '.'
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      consumeT(4);                  // Identifier
      lookahead1W(123);             // WhiteSpace | Comment | '!=' | '%' | '%=' | '&' | '&&' | '&=' | '(' | ')' | '*' |
                                    // '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' | '.' | '/' | '/=' | ':' |
                                    // ';' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '>>>' | '>>>=' | '?' | '[' | ']' | '^' | '^=' | 'instanceof' | '|' | '|=' |
                                    // '||' | '}'
      if (l1 == 19)                 // '('
      {
        try_Arguments();
      }
      break;
    case 4638:                      // '.' '<'
      consumeT(30);                 // '.'
      lookahead1W(8);               // WhiteSpace | Comment | '<'
      try_ExplicitGenericInvocation();
      break;
    case 12062:                     // '.' 'this'
      consumeT(30);                 // '.'
      lookahead1W(17);              // WhiteSpace | Comment | 'this'
      consumeT(94);                 // 'this'
      break;
    case 11678:                     // '.' 'super'
      consumeT(30);                 // '.'
      lookahead1W(16);              // WhiteSpace | Comment | 'super'
      consumeT(91);                 // 'super'
      lookahead1W(28);              // WhiteSpace | Comment | '(' | '.'
      try_SuperSuffix();
      break;
    case 10526:                     // '.' 'new'
      consumeT(30);                 // '.'
      lookahead1W(15);              // WhiteSpace | Comment | 'new'
      consumeT(82);                 // 'new'
      lookahead1W(23);              // WhiteSpace | Comment | Identifier | '<'
      if (l1 == 36)                 // '<'
      {
        try_NonWildcardTypeArguments();
      }
      lookahead1W(0);               // WhiteSpace | Comment | Identifier
      try_InnerCreator();
      break;
    default:
      consumeT(50);                 // '['
      lookahead1W(95);              // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '~'
      try_Expression();
      consumeT(51);                 // ']'
      break;
    }
  }

  void parse_EnumBody()
  {
    eventHandler->startNonterminal(L"EnumBody", e0);
    consume(102);                   // '{'
    lookahead1W(70);                // WhiteSpace | Comment | Identifier | ',' | ';' | '@' | '}'
    if (l1 == 4                     // Identifier
     || l1 == 49)                   // '@'
    {
      whitespace();
      parse_EnumConstant();
      for (;;)
      {
        lookahead1W(52);            // WhiteSpace | Comment | ',' | ';' | '}'
        switch (l1)
        {
        case 26:                    // ','
          lookahead2W(61);          // WhiteSpace | Comment | Identifier | ';' | '@' | '}'
          break;
        default:
          lk = l1;
          break;
        }
        if (lk != 538               // ',' Identifier
         && lk != 6298)             // ',' '@'
        {
          break;
        }
        consume(26);                // ','
        lookahead1W(24);            // WhiteSpace | Comment | Identifier | '@'
        whitespace();
        parse_EnumConstant();
      }
    }
    if (l1 == 26)                   // ','
    {
      consume(26);                  // ','
    }
    lookahead1W(39);                // WhiteSpace | Comment | ';' | '}'
    if (l1 == 35)                   // ';'
    {
      whitespace();
      parse_EnumBodyDeclarations();
    }
    consume(106);                   // '}'
    eventHandler->endNonterminal(L"EnumBody", e0);
  }

  void try_EnumBody()
  {
    consumeT(102);                  // '{'
    lookahead1W(70);                // WhiteSpace | Comment | Identifier | ',' | ';' | '@' | '}'
    if (l1 == 4                     // Identifier
     || l1 == 49)                   // '@'
    {
      try_EnumConstant();
      for (;;)
      {
        lookahead1W(52);            // WhiteSpace | Comment | ',' | ';' | '}'
        switch (l1)
        {
        case 26:                    // ','
          lookahead2W(61);          // WhiteSpace | Comment | Identifier | ';' | '@' | '}'
          break;
        default:
          lk = l1;
          break;
        }
        if (lk != 538               // ',' Identifier
         && lk != 6298)             // ',' '@'
        {
          break;
        }
        consumeT(26);               // ','
        lookahead1W(24);            // WhiteSpace | Comment | Identifier | '@'
        try_EnumConstant();
      }
    }
    if (l1 == 26)                   // ','
    {
      consumeT(26);                 // ','
    }
    lookahead1W(39);                // WhiteSpace | Comment | ';' | '}'
    if (l1 == 35)                   // ';'
    {
      try_EnumBodyDeclarations();
    }
    consumeT(106);                  // '}'
  }

  void parse_EnumConstant()
  {
    eventHandler->startNonterminal(L"EnumConstant", e0);
    if (l1 == 49)                   // '@'
    {
      whitespace();
      parse_Annotations();
    }
    consume(4);                     // Identifier
    lookahead1W(73);                // WhiteSpace | Comment | '(' | ',' | ';' | '{' | '}'
    if (l1 == 19)                   // '('
    {
      whitespace();
      parse_Arguments();
    }
    lookahead1W(64);                // WhiteSpace | Comment | ',' | ';' | '{' | '}'
    if (l1 == 102)                  // '{'
    {
      whitespace();
      parse_ClassBody();
    }
    eventHandler->endNonterminal(L"EnumConstant", e0);
  }

  void try_EnumConstant()
  {
    if (l1 == 49)                   // '@'
    {
      try_Annotations();
    }
    consumeT(4);                    // Identifier
    lookahead1W(73);                // WhiteSpace | Comment | '(' | ',' | ';' | '{' | '}'
    if (l1 == 19)                   // '('
    {
      try_Arguments();
    }
    lookahead1W(64);                // WhiteSpace | Comment | ',' | ';' | '{' | '}'
    if (l1 == 102)                  // '{'
    {
      try_ClassBody();
    }
  }

  void parse_EnumBodyDeclarations()
  {
    eventHandler->startNonterminal(L"EnumBodyDeclarations", e0);
    consume(35);                    // ';'
    for (;;)
    {
      lookahead1W(106);             // WhiteSpace | Comment | Identifier | ';' | '<' | '@' | 'abstract' | 'boolean' |
                                    // 'byte' | 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' |
                                    // 'interface' | 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' |
                                    // 'static' | 'strictfp' | 'synchronized' | 'transient' | 'void' | 'volatile' |
                                    // '{' | '}'
      if (l1 == 106)                // '}'
      {
        break;
      }
      whitespace();
      parse_ClassBodyDeclaration();
    }
    eventHandler->endNonterminal(L"EnumBodyDeclarations", e0);
  }

  void try_EnumBodyDeclarations()
  {
    consumeT(35);                   // ';'
    for (;;)
    {
      lookahead1W(106);             // WhiteSpace | Comment | Identifier | ';' | '<' | '@' | 'abstract' | 'boolean' |
                                    // 'byte' | 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' |
                                    // 'interface' | 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' |
                                    // 'static' | 'strictfp' | 'synchronized' | 'transient' | 'void' | 'volatile' |
                                    // '{' | '}'
      if (l1 == 106)                // '}'
      {
        break;
      }
      try_ClassBodyDeclaration();
    }
  }

  void parse_AnnotationTypeBody()
  {
    eventHandler->startNonterminal(L"AnnotationTypeBody", e0);
    consume(102);                   // '{'
    for (;;)
    {
      lookahead1W(93);              // WhiteSpace | Comment | Identifier | '@' | 'abstract' | 'boolean' | 'byte' |
                                    // 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'volatile' | '}'
      if (l1 == 106)                // '}'
      {
        break;
      }
      whitespace();
      parse_AnnotationTypeElementDeclaration();
    }
    consume(106);                   // '}'
    eventHandler->endNonterminal(L"AnnotationTypeBody", e0);
  }

  void try_AnnotationTypeBody()
  {
    consumeT(102);                  // '{'
    for (;;)
    {
      lookahead1W(93);              // WhiteSpace | Comment | Identifier | '@' | 'abstract' | 'boolean' | 'byte' |
                                    // 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'volatile' | '}'
      if (l1 == 106)                // '}'
      {
        break;
      }
      try_AnnotationTypeElementDeclaration();
    }
    consumeT(106);                  // '}'
  }

  void parse_AnnotationTypeElementDeclaration()
  {
    eventHandler->startNonterminal(L"AnnotationTypeElementDeclaration", e0);
    for (;;)
    {
      lookahead1W(92);              // WhiteSpace | Comment | Identifier | '@' | 'abstract' | 'boolean' | 'byte' |
                                    // 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'volatile'
      switch (l1)
      {
      case 49:                      // '@'
        lookahead2W(25);            // WhiteSpace | Comment | Identifier | 'interface'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk != 54                  // 'abstract'
       && lk != 70                  // 'final'
       && lk != 81                  // 'native'
       && lk != 84                  // 'private'
       && lk != 85                  // 'protected'
       && lk != 86                  // 'public'
       && lk != 89                  // 'static'
       && lk != 90                  // 'strictfp'
       && lk != 93                  // 'synchronized'
       && lk != 97                  // 'transient'
       && lk != 100                 // 'volatile'
       && lk != 561)                // '@' Identifier
      {
        break;
      }
      whitespace();
      parse_Modifier();
    }
    whitespace();
    parse_AnnotationTypeElementRest();
    eventHandler->endNonterminal(L"AnnotationTypeElementDeclaration", e0);
  }

  void try_AnnotationTypeElementDeclaration()
  {
    for (;;)
    {
      lookahead1W(92);              // WhiteSpace | Comment | Identifier | '@' | 'abstract' | 'boolean' | 'byte' |
                                    // 'char' | 'class' | 'double' | 'enum' | 'final' | 'float' | 'int' | 'interface' |
                                    // 'long' | 'native' | 'private' | 'protected' | 'public' | 'short' | 'static' |
                                    // 'strictfp' | 'synchronized' | 'transient' | 'volatile'
      switch (l1)
      {
      case 49:                      // '@'
        lookahead2W(25);            // WhiteSpace | Comment | Identifier | 'interface'
        break;
      default:
        lk = l1;
        break;
      }
      if (lk != 54                  // 'abstract'
       && lk != 70                  // 'final'
       && lk != 81                  // 'native'
       && lk != 84                  // 'private'
       && lk != 85                  // 'protected'
       && lk != 86                  // 'public'
       && lk != 89                  // 'static'
       && lk != 90                  // 'strictfp'
       && lk != 93                  // 'synchronized'
       && lk != 97                  // 'transient'
       && lk != 100                 // 'volatile'
       && lk != 561)                // '@' Identifier
      {
        break;
      }
      try_Modifier();
    }
    try_AnnotationTypeElementRest();
  }

  void parse_AnnotationTypeElementRest()
  {
    eventHandler->startNonterminal(L"AnnotationTypeElementRest", e0);
    switch (l1)
    {
    case 49:                        // '@'
      lookahead2W(14);              // WhiteSpace | Comment | 'interface'
      break;
    case 68:                        // 'enum'
      lookahead2W(0);               // WhiteSpace | Comment | Identifier
      break;
    default:
      lk = l1;
      break;
    }
    if (lk == 580                   // 'enum' Identifier
     || lk == 10161)                // '@' 'interface'
    {
      lk = memoized(13, e0);
      if (lk == 0)
      {
        int b0A = b0; int e0A = e0; int l1A = l1;
        int b1A = b1; int e1A = e1; int l2A = l2;
        int b2A = b2; int e2A = e2;
        try
        {
          try_ClassDeclaration();
          lk = -2;
        }
        catch (ParseException &)
        {
          try
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; end = e2A; }}
            try_InterfaceDeclaration();
            lk = -3;
          }
          catch (ParseException &)
          {
            try
            {
              b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
              b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
              b2 = b2A; e2 = e2A; end = e2A; }}
              try_EnumDeclaration();
              lk = -4;
            }
            catch (ParseException &)
            {
              lk = -5;
            }
          }
        }
        b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
        b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
        b2 = b2A; e2 = e2A; end = e2A; }}
        memoize(13, e0, lk);
      }
    }
    switch (lk)
    {
    case -2:
    case 62:                        // 'class'
      parse_ClassDeclaration();
      break;
    case -3:
    case 79:                        // 'interface'
      parse_InterfaceDeclaration();
      break;
    case -4:
      parse_EnumDeclaration();
      break;
    case -5:
      parse_AnnotationTypeDeclaration();
      break;
    default:
      parse_Type();
      consume(4);                   // Identifier
      lookahead1W(51);              // WhiteSpace | Comment | '(' | '=' | '['
      whitespace();
      parse_AnnotationMethodOrConstantRest();
      lookahead1W(7);               // WhiteSpace | Comment | ';'
      consume(35);                  // ';'
      break;
    }
    eventHandler->endNonterminal(L"AnnotationTypeElementRest", e0);
  }

  void try_AnnotationTypeElementRest()
  {
    switch (l1)
    {
    case 49:                        // '@'
      lookahead2W(14);              // WhiteSpace | Comment | 'interface'
      break;
    case 68:                        // 'enum'
      lookahead2W(0);               // WhiteSpace | Comment | Identifier
      break;
    default:
      lk = l1;
      break;
    }
    if (lk == 580                   // 'enum' Identifier
     || lk == 10161)                // '@' 'interface'
    {
      lk = memoized(13, e0);
      if (lk == 0)
      {
        int b0A = b0; int e0A = e0; int l1A = l1;
        int b1A = b1; int e1A = e1; int l2A = l2;
        int b2A = b2; int e2A = e2;
        try
        {
          try_ClassDeclaration();
          memoize(13, e0A, -2);
          lk = -6;
        }
        catch (ParseException &)
        {
          try
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; end = e2A; }}
            try_InterfaceDeclaration();
            memoize(13, e0A, -3);
            lk = -6;
          }
          catch (ParseException &)
          {
            try
            {
              b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
              b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
              b2 = b2A; e2 = e2A; end = e2A; }}
              try_EnumDeclaration();
              memoize(13, e0A, -4);
              lk = -6;
            }
            catch (ParseException &)
            {
              lk = -5;
              b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
              b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
              b2 = b2A; e2 = e2A; end = e2A; }}
              memoize(13, e0A, -5);
            }
          }
        }
      }
    }
    switch (lk)
    {
    case -2:
    case 62:                        // 'class'
      try_ClassDeclaration();
      break;
    case -3:
    case 79:                        // 'interface'
      try_InterfaceDeclaration();
      break;
    case -4:
      try_EnumDeclaration();
      break;
    case -5:
      try_AnnotationTypeDeclaration();
      break;
    case -6:
      break;
    default:
      try_Type();
      consumeT(4);                  // Identifier
      lookahead1W(51);              // WhiteSpace | Comment | '(' | '=' | '['
      try_AnnotationMethodOrConstantRest();
      lookahead1W(7);               // WhiteSpace | Comment | ';'
      consumeT(35);                 // ';'
      break;
    }
  }

  void parse_AnnotationMethodOrConstantRest()
  {
    eventHandler->startNonterminal(L"AnnotationMethodOrConstantRest", e0);
    switch (l1)
    {
    case 19:                        // '('
      parse_AnnotationMethodRest();
      break;
    default:
      parse_ConstantDeclaratorsRest();
      break;
    }
    eventHandler->endNonterminal(L"AnnotationMethodOrConstantRest", e0);
  }

  void try_AnnotationMethodOrConstantRest()
  {
    switch (l1)
    {
    case 19:                        // '('
      try_AnnotationMethodRest();
      break;
    default:
      try_ConstantDeclaratorsRest();
      break;
    }
  }

  void parse_AnnotationMethodRest()
  {
    eventHandler->startNonterminal(L"AnnotationMethodRest", e0);
    consume(19);                    // '('
    lookahead1W(3);                 // WhiteSpace | Comment | ')'
    consume(20);                    // ')'
    lookahead1W(54);                // WhiteSpace | Comment | ';' | '[' | 'default'
    if (l1 == 50)                   // '['
    {
      consume(50);                  // '['
      lookahead1W(12);              // WhiteSpace | Comment | ']'
      consume(51);                  // ']'
    }
    lookahead1W(37);                // WhiteSpace | Comment | ';' | 'default'
    if (l1 == 64)                   // 'default'
    {
      consume(64);                  // 'default'
      lookahead1W(104);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | '@' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '~'
      whitespace();
      parse_ElementValue();
    }
    eventHandler->endNonterminal(L"AnnotationMethodRest", e0);
  }

  void try_AnnotationMethodRest()
  {
    consumeT(19);                   // '('
    lookahead1W(3);                 // WhiteSpace | Comment | ')'
    consumeT(20);                   // ')'
    lookahead1W(54);                // WhiteSpace | Comment | ';' | '[' | 'default'
    if (l1 == 50)                   // '['
    {
      consumeT(50);                 // '['
      lookahead1W(12);              // WhiteSpace | Comment | ']'
      consumeT(51);                 // ']'
    }
    lookahead1W(37);                // WhiteSpace | Comment | ';' | 'default'
    if (l1 == 64)                   // 'default'
    {
      consumeT(64);                 // 'default'
      lookahead1W(104);             // WhiteSpace | Comment | Identifier | IntegerLiteral | FloatingPointLiteral |
                                    // BooleanLiteral | CharacterLiteral | StringLiteral | NullLiteral | '!' | '(' |
                                    // '+' | '++' | '-' | '--' | '<' | '@' | 'boolean' | 'byte' | 'char' | 'double' |
                                    // 'float' | 'int' | 'long' | 'new' | 'short' | 'super' | 'this' | 'void' | '{' |
                                    // '~'
      try_ElementValue();
    }
  }

  void consume(int t)
  {
    if (l1 == t)
    {
      whitespace();
      eventHandler->terminal(TOKEN[l1], b1, e1);
      b0 = b1; e0 = e1; l1 = l2; if (l1 != 0) {
      b1 = b2; e1 = e2; l2 = 0; }
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  void consumeT(int t)
  {
    if (l1 == t)
    {
      b0 = b1; e0 = e1; l1 = l2; if (l1 != 0) {
      b1 = b2; e1 = e2; l2 = 0; }
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  void whitespace()
  {
    if (e0 != b1)
    {
      eventHandler->whitespace(e0, b1);
      e0 = b1;
    }
  }

  int matchW(int tokenSetId)
  {
    int code;
    for (;;)
    {
      code = match(tokenSetId);
      if (code != 2                 // WhiteSpace
       && code != 3)                // Comment
      {
        break;
      }
    }
    return code;
  }

  void lookahead1W(int tokenSetId)
  {
    if (l1 == 0)
    {
      l1 = matchW(tokenSetId);
      b1 = begin;
      e1 = end;
    }
  }

  void lookahead2W(int tokenSetId)
  {
    if (l2 == 0)
    {
      l2 = matchW(tokenSetId);
      b2 = begin;
      e2 = end;
    }
    lk = (l2 << 7) | l1;
  }

  int error(int b, int e, int s, int l, int t)
  {
    if (e >= ex)
    {
      bx = b;
      ex = e;
      sx = s;
      lx = l;
      tx = t;
    }
    throw ParseException(bx, ex, sx, lx, tx);
  }

  int lk, b0, e0;
  int l1, b1, e1;
  int l2, b2, e2;
  int bx, ex, sx, lx, tx;
  EventHandler *eventHandler;
  std::map<int, int> memo;

  void memoize(int i, int e, int v)
  {
    memo[(e << 4) + i] = v;
  }

  int memoized(int i, int e)
  {
    std::map<int, int>::iterator v = memo.find((e << 4) + i);
    return v != memo.end() ? v->second : 0;
  }

  const wchar_t *input;
  int begin;
  int end;

  int match(int tokenSetId)
  {
    bool nonbmp = false;
    begin = end;
    int current = end;
    int result = INITIAL[tokenSetId];
    int state = 0;

    for (int code = result & 1023; code != 0; )
    {
      int charclass;
      int c0 = input[current];
      ++current;
      if (c0 < 0x80)
      {
        charclass = MAP0[c0];
      }
      else if (c0 < 0xd800)
      {
        int c1 = c0 >> 3;
        charclass = MAP1[(c0 & 7) + MAP1[(c1 & 15) + MAP1[c1 >> 4]]];
      }
      else
      {
        if (c0 < 0xdc00)
        {
          int c1 = input[current];
          if (c1 >= 0xdc00 && c1 < 0xe000)
          {
            nonbmp = true;
            ++current;
            c0 = ((c0 & 0x3ff) << 10) + (c1 & 0x3ff) + 0x10000;
          }
        }
        int lo = 0, hi = 77;
        for (int m = 39; ; m = (hi + lo) >> 1)
        {
          if (MAP2[m] > c0) hi = m - 1;
          else if (MAP2[78 + m] < c0) lo = m + 1;
          else {charclass = MAP2[156 + m]; break;}
          if (lo > hi) {charclass = 0; break;}
        }
      }

      state = code;
      int i0 = (charclass << 10) + code - 1;
      code = TRANSITION[(i0 & 15) + TRANSITION[i0 >> 4]];
      if (code > 1023)
      {
        result = code;
        code &= 1023;
        end = current;
      }
    }

    result >>= 10;
    if (result == 0)
    {
      end = current - 1;
      int c1 = input[end];
      if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      return error(begin, end, state, -1, -1);
    }

    if (nonbmp)
    {
      for (int i = result >> 7; i > 0; --i)
      {
        int c1 = input[--end];
        if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      }
    }
    else
    {
      end -= result >> 7;
    }

    if (input[begin] == 0) end = begin;
    return (result & 127) - 1;
  }

  class FileNotFound
  {
  public:
    FileNotFound(std::string name) : filename(name) {}
    const std::string &getFilename() const {return filename;}

  private:
    std::string filename;
  };

  class MalformedInputException
  {
  public:
    MalformedInputException(size_t offset) : offset(offset) {}
    size_t getOffset() const {return offset;}

  private:
    size_t offset;
  };

  class Utf8Encoder
  {
  public:
    static std::string encode(const wchar_t *unencoded)
    {
      return encode(unencoded, wcslen(unencoded));
    }

    static std::string encode(const wchar_t *unencoded, size_t size)
    {
      std::string encoded;
      encoded.reserve(size + 3);

      for (size_t i = 0; i < size; ++i)
      {
        if (encoded.size() + 4 >= encoded.capacity()) encoded.reserve(encoded.capacity() * 2);

        int w = unencoded[i];
        if (w < 0x80)
        {
          encoded += w;
        }
        else if (w < 0x800)
        {
          encoded += 0xc0 | (w >> 6);
          encoded += 0x80 | (w & 0x3f);
        }
        else if (w < 0xd800)
        {
          encoded += 0xe0 | ( w          >> 12);
          encoded += 0x80 | ((w & 0xfff) >>  6);
          encoded += 0x80 | ( w &  0x3f       );
        }
        else if (w < 0xe000)
        {
          if (++i >= size)
          {
            throw MalformedInputException(i - 1);
          }
          int w2 = unencoded[i];
          if (w2 < 0xdc00 || w2 > 0xdfff)
          {
            throw MalformedInputException(i - 1);
          }
          w = (((w  & 0x3ff) << 10) | (w2 & 0x3ff)) + 0x10000;
          encoded += 0xf0 | ( w            >> 18);
          encoded += 0x80 | ((w & 0x3ffff) >> 12);
          encoded += 0x80 | ((w &   0xfff) >>  6);
          encoded += 0x80 | ( w &    0x3f       );
        }
        else if (w < 0x10000)
        {
          encoded += 0xe0 | ( w          >> 12);
          encoded += 0x80 | ((w & 0xfff) >>  6);
          encoded += 0x80 | ( w &  0x3f       );
        }
        else if (w < 0x110000)
        {
          encoded += 0xf0 | ( w            >> 18);
          encoded += 0x80 | ((w & 0x3ffff) >> 12);
          encoded += 0x80 | ((w &   0xfff) >>  6);
          encoded += 0x80 | ( w &    0x3f       );
        }
        else
        {
          throw MalformedInputException(i);
        }
      }
      return encoded;
    }
  };

  class Utf8Decoder
  {
  public:
    static std::wstring decode(const char *string)
    {
      return decode(string, strlen(string));
    }

    static std::wstring decode(const char *string, size_t size)
    {
      std::wstring decoded;
      decoded.reserve(size + 1);

      for (size_t consumed = 0; consumed < size; )
      {
        if (decoded.size() + 2 >= decoded.capacity()) decoded.reserve(decoded.capacity() * 2);

        size_t bytes;
        int codepoint = decodeChar(string + consumed, &bytes);

        if (bytes == 0)
        {
          throw MalformedInputException(consumed);
        }

        consumed += bytes;

        if (codepoint < 0x10000)
        {
          decoded += codepoint;
        }
        else
        {
          codepoint -= 0x10000;
          decoded += 0x0d800 | (codepoint >> 10);
          decoded += 0x0dc00 | (codepoint & 0x3ff);
        }
      }

      return decoded;
    }

  private:
    static int decodeChar(const char *input, size_t *size)
    {
      int codepoint = input[0];
      if ((codepoint & 0x80) == 0)
      {
        *size = 1;
      }
      else if (   (codepoint & 0x60) == 0x40
               && (input[1]  & 0xc0) == 0x80)
      {
        codepoint = ((codepoint & 0x1f) << 6)
                  |  (input[1]  & 0x3f);
        *size = codepoint < 0x80 ? 0 : 2;
      }
      else if (   (codepoint & 0x70) == 0x60
               && (input[1]  & 0xc0) == 0x80
               && (input[2]  & 0xc0) == 0x80)
      {
        codepoint = ((codepoint &  0xf) << 12)
                  | ((input[1]  & 0x3f) <<  6)
                  |  (input[2]  & 0x3f);
        *size = codepoint < 0x800 ? 0 : 3;
      }
      else if (   (codepoint & 0x78) == 0x70
               && (input[1]  & 0xc0) == 0x80
               && (input[2]  & 0xc0) == 0x80
               && (input[3]  & 0xc0) == 0x80)
      {
        codepoint  = ((codepoint &  0x7) << 18)
                   | ((input[1]  & 0x3f) << 12)
                   | ((input[2]  & 0x3f) <<  6)
                   | ( input[3]  & 0x3f       );
        *size = codepoint < 0x10000 || codepoint > 0x10ffff ? 0 : 4;
      }
      else
      {
        *size = 0;
      }
      return codepoint;
    }
  };

  static std::wstring read(const char *input)
  {
    size_t l = strlen(input);
    if (l > 0 && input[0] == '{' && input[l - 1] == '}')
    {
      return Utf8Decoder::decode(input + 1, l - 2);
    }
    else
    {
      FILE *file = fopen(input, "rb");
      if (file == 0)
      {
        throw FileNotFound(std::string(input));
      }

      std::string content;
      content.reserve(4096);

      for (int c = getc(file); c != EOF; c = getc(file))
      {
        if (content.size() + 1 >= content.capacity()) content.reserve(content.capacity() * 2);
        content += c;
      }

      fclose(file);

      if (content.size() >= 3
       && (unsigned char) content[0] == 0xef
       && (unsigned char) content[1] == 0xbb
       && (unsigned char) content[2] == 0xbf)
      {
        content.erase(0, 3);
      }

      return Utf8Decoder::decode(content.c_str());
    }
  }

  static void getTokenSet(int tokenSetId, const wchar_t **set, int size)
  {
    int s = tokenSetId < 0 ? - tokenSetId : INITIAL[tokenSetId] & 1023;
    for (int i = 0; i < 108; i += 32)
    {
      int j = i;
      for (unsigned int f = ec(i >> 5, s); f != 0; f >>= 1, ++j)
      {
        if ((f & 1) != 0)
        {
          if (size > 1)
          {
            set[0] = TOKEN[j];
            ++set;
            --size;
          }
        }
      }
    }
    if (size > 0)
    {
      set[0] = 0;
    }
  }

  static int ec(int t, int s)
  {
    int i0 = t * 796 + s - 1;
    int i1 = i0 >> 2;
    return EXPECTED[(i0 & 3) + EXPECTED[(i1 & 3) + EXPECTED[i1 >> 2]]];
  }

  static const int MAP0[];
  static const int MAP1[];
  static const int MAP2[];
  static const int INITIAL[];
  static const int TRANSITION[];
  static const int EXPECTED[];
  static const wchar_t *TOKEN[];
};

const int Java::MAP0[] =
{
/*   0 */ 75, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 1, 2, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 2, 6, 7, 1,
/*  36 */ 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 22, 23, 24, 23, 23, 25, 25, 26, 27, 28, 29, 30, 31,
/*  64 */ 32, 33, 34, 35, 36, 37, 36, 8, 8, 8, 8, 8, 38, 8, 8, 8, 39, 8, 8, 8, 8, 8, 8, 8, 40, 8, 8, 41, 42, 43, 44, 45,
/*  96 */ 1, 46, 47, 48, 49, 50, 51, 52, 53, 54, 8, 55, 56, 57, 58, 59, 60, 8, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
/* 124 */ 71, 72, 73, 74
};

const int Java::MAP1[] =
{
/*    0 */ 432, 448, 1325, 1325, 1325, 1233, 1261, 504, 1325, 537, 693, 463, 556, 1286, 478, 602, 618, 521, 653, 709,
/*   20 */ 725, 741, 757, 773, 789, 819, 835, 851, 668, 867, 1014, 883, 910, 941, 1325, 1325, 968, 957, 984, 1355, 1324,
/*   41 */ 1325, 1325, 1325, 540, 1000, 1030, 925, 683, 1046, 1491, 1447, 1078, 1094, 1116, 1132, 1148, 1100, 1325,
/*   59 */ 1205, 1325, 1325, 1161, 1177, 586, 803, 1193, 519, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521, 521,
/*   79 */ 521, 521, 521, 521, 521, 521, 521, 521, 521, 1221, 637, 1379, 1249, 894, 521, 521, 521, 1277, 1302, 1318,
/*   99 */ 1341, 521, 521, 521, 521, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  118 */ 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  136 */ 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  154 */ 1325, 1054, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  172 */ 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  190 */ 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  208 */ 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  226 */ 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  244 */ 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  262 */ 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  280 */ 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  298 */ 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  316 */ 1325, 1325, 1325, 488, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1368, 1325, 1325, 1395, 571,
/*  334 */ 632, 1411, 1427, 1463, 1479, 1507, 1523, 1539, 1555, 1062, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  352 */ 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  370 */ 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  388 */ 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  406 */ 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1325,
/*  424 */ 1325, 1325, 1325, 1325, 1325, 1325, 1325, 1437, 1571, 1591, 1572, 1597, 1610, 1618, 1626, 1634, 1642, 1674,
/*  442 */ 1705, 1723, 1731, 1739, 1747, 1755, 1690, 1690, 1690, 1690, 2159, 2186, 1575, 1578, 1652, 1652, 1706, 1652,
/*  460 */ 1652, 1652, 1706, 1652, 1572, 1689, 1690, 1690, 1690, 1690, 1810, 1819, 1572, 1652, 1652, 1652, 1710, 1710,
/*  478 */ 1572, 1581, 2139, 1652, 1652, 1652, 1690, 1690, 1690, 1850, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652,
/*  496 */ 1652, 1709, 1572, 1572, 1572, 1572, 1572, 1572, 1574, 1878, 1652, 1652, 1783, 1652, 1652, 1652, 1652, 1652,
/*  514 */ 1652, 1652, 1652, 1652, 1786, 1652, 1580, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572,
/*  532 */ 1572, 1572, 1572, 1572, 1572, 1797, 1650, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652,
/*  550 */ 1652, 1652, 1652, 2021, 1652, 1652, 1694, 1577, 1690, 1695, 1652, 1652, 1652, 1652, 1652, 1657, 1690, 1690,
/*  568 */ 1690, 1946, 1666, 1652, 1652, 1652, 1572, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1696,
/*  586 */ 1572, 1912, 1572, 1572, 1572, 1913, 1572, 1573, 1580, 1572, 1576, 1572, 1693, 1688, 1579, 1573, 1652, 1652,
/*  604 */ 1652, 1652, 1654, 1690, 1842, 1572, 1690, 1665, 1652, 1652, 1652, 1657, 1764, 1578, 1652, 1652, 1654, 2090,
/*  622 */ 2088, 2092, 1572, 1572, 1652, 1652, 1652, 1944, 1572, 1572, 1572, 1572, 1573, 1652, 1650, 1652, 1652, 1652,
/*  640 */ 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1708, 1938, 1696, 1572, 1663, 1652, 1652, 1652, 1652,
/*  658 */ 1652, 1652, 1861, 1690, 1690, 1659, 1652, 2202, 1690, 1651, 1651, 1652, 1652, 1652, 1652, 1652, 2048, 1945,
/*  676 */ 1653, 1691, 1690, 1696, 1572, 1572, 1572, 1572, 2149, 1690, 1696, 1652, 1652, 1652, 1652, 1652, 1652, 1652,
/*  694 */ 1652, 1652, 1652, 1652, 1572, 1651, 1652, 1652, 1652, 1706, 1579, 1651, 1652, 1652, 1652, 1873, 2021, 1649,
/*  712 */ 1652, 1652, 1784, 1886, 1899, 2093, 2040, 1581, 1770, 2202, 1690, 1709, 1577, 1873, 1990, 1649, 1652, 1652,
/*  730 */ 1784, 1981, 1921, 2208, 2205, 1933, 1969, 1713, 1690, 1954, 1572, 1873, 1786, 1783, 1652, 1652, 1784, 1984,
/*  748 */ 1899, 1810, 2005, 1580, 1572, 2202, 1690, 1579, 1572, 1873, 2021, 1649, 1652, 1652, 1784, 1984, 1899, 2093,
/*  766 */ 2205, 1713, 1770, 2202, 1690, 1579, 1572, 1965, 1679, 1987, 1977, 1889, 1679, 1652, 1909, 2008, 2123, 1712,
/*  784 */ 1572, 1713, 1690, 1572, 1579, 1873, 1780, 1784, 1652, 1652, 1784, 1781, 1999, 1800, 2123, 1714, 1711, 2202,
/*  802 */ 1690, 1572, 1572, 1652, 1708, 1652, 1652, 1652, 1711, 1572, 1572, 1690, 1693, 2147, 1690, 1697, 1572, 2016,
/*  820 */ 1780, 1784, 1652, 1652, 1784, 1781, 1899, 1800, 2123, 1714, 1574, 2202, 1690, 1891, 1572, 2016, 1780, 1784,
/*  838 */ 1652, 1652, 1652, 1652, 2056, 1800, 1925, 1581, 1572, 2202, 1690, 1572, 1650, 2016, 1652, 1706, 1650, 1652,
/*  856 */ 1652, 1783, 1788, 1706, 2189, 1811, 1690, 1572, 1572, 2030, 1572, 2064, 2066, 1601, 1651, 1877, 1772, 2048,
/*  874 */ 1823, 1787, 1692, 1690, 1905, 1572, 1572, 1572, 1572, 1800, 1655, 1690, 1689, 1690, 1690, 1690, 1693, 1582,
/*  892 */ 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1573, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572,
/*  910 */ 1652, 1652, 1652, 1652, 1652, 1657, 1690, 1660, 1690, 1696, 1654, 2074, 1865, 1661, 2051, 1652, 1652, 1652,
/*  928 */ 1652, 1652, 1652, 1656, 1690, 1690, 1690, 2125, 2035, 1690, 1696, 1572, 1572, 1658, 2086, 1690, 1692, 1652,
/*  946 */ 1652, 1652, 1652, 1707, 1572, 1652, 1652, 1652, 1652, 1652, 1789, 1652, 1987, 1652, 1652, 1652, 1652, 1987,
/*  964 */ 1706, 1987, 1652, 1706, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1987, 1706, 1987, 1652, 1652,
/*  982 */ 1652, 1652, 1652, 1652, 1987, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1685, 1572, 1572, 1572, 1572,
/* 1000 */ 1651, 1652, 1652, 1710, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1679, 1580, 1572, 1572, 1696,
/* 1018 */ 1690, 1696, 1583, 2190, 1652, 1651, 1652, 1652, 1652, 1708, 1689, 1690, 1652, 1780, 1943, 1572, 1652, 1652,
/* 1036 */ 1943, 1572, 1652, 1652, 2078, 1572, 1652, 1780, 2101, 1572, 1652, 1652, 1652, 1652, 1652, 1841, 1652, 1652,
/* 1054 */ 1652, 1652, 1652, 1652, 1652, 1652, 1707, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1652, 1652,
/* 1072 */ 1652, 1652, 1657, 1802, 1690, 1696, 1652, 1652, 1653, 1694, 1652, 1652, 1652, 1652, 1652, 1652, 1655, 1691,
/* 1090 */ 1690, 1690, 1690, 2093, 1690, 1696, 1690, 1696, 1573, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572,
/* 1108 */ 1572, 1572, 2121, 1690, 1690, 2135, 1957, 1572, 1662, 1652, 1652, 1652, 1652, 1652, 1656, 1690, 1662, 1709,
/* 1126 */ 1690, 1696, 1572, 1912, 1694, 1572, 1664, 1652, 1652, 1652, 1659, 2126, 1690, 1696, 1652, 1652, 1652, 1652,
/* 1144 */ 1654, 1690, 1694, 1572, 1652, 1652, 1652, 1652, 1656, 1690, 1690, 1572, 1690, 2127, 1690, 1665, 1652, 1652,
/* 1162 */ 1652, 1707, 1707, 1652, 1652, 1652, 1652, 1707, 1707, 1652, 2113, 1652, 1652, 1652, 1707, 1652, 1652, 1652,
/* 1180 */ 1652, 1652, 1652, 1780, 1787, 1853, 1708, 2022, 1709, 1652, 1708, 1853, 1708, 2107, 1650, 1788, 2020, 2110,
/* 1198 */ 1968, 1652, 2157, 1600, 1991, 1572, 1572, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1690, 1690, 1690,
/* 1216 */ 1690, 1691, 1572, 1572, 1911, 1652, 1652, 1652, 1652, 1652, 1706, 1652, 1652, 1652, 1652, 1652, 1706, 1652,
/* 1234 */ 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1768, 1652, 1711, 1572, 1708, 2110, 1572, 1572, 1652, 1652, 1706,
/* 1252 */ 1572, 1706, 1706, 1706, 1706, 1706, 1706, 1706, 1706, 1690, 1690, 1690, 1690, 1690, 1690, 1690, 1690, 1690,
/* 1270 */ 1690, 1690, 1690, 1690, 1690, 1780, 2159, 1600, 1572, 1572, 1572, 1651, 1658, 2020, 1708, 1651, 1652, 1652,
/* 1288 */ 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 2172, 1810, 1831, 1762, 1690, 2054, 1652, 1652, 1706, 2167,
/* 1306 */ 1651, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1782, 1600, 1652, 1652, 1652, 1652, 1707,
/* 1324 */ 1651, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652,
/* 1342 */ 1706, 1572, 1572, 1652, 1652, 1652, 1710, 1572, 1572, 1572, 1572, 1572, 1572, 1652, 1652, 1572, 1572, 1652,
/* 1360 */ 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1652, 1708, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572,
/* 1378 */ 1652, 1652, 1652, 1652, 1652, 1707, 1572, 1652, 1652, 1652, 1652, 1652, 1652, 1707, 1573, 1572, 1581, 1652,
/* 1396 */ 1708, 1652, 1652, 1690, 1766, 1572, 1572, 1652, 1652, 1652, 1652, 1652, 1653, 1572, 1715, 1652, 2158, 1711,
/* 1414 */ 1572, 1652, 1711, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1650, 1836, 2137, 1652, 1652, 1657,
/* 1432 */ 1572, 1572, 1580, 1652, 1652, 1652, 1652, 1652, 1652, 1709, 1572, 1652, 1652, 1706, 1602, 1652, 1652, 1652,
/* 1450 */ 1652, 1652, 1709, 1690, 1690, 1666, 1696, 1690, 1696, 1572, 1572, 1572, 1572, 1665, 1652, 1652, 1652, 1652,
/* 1468 */ 1652, 1656, 1690, 1693, 1572, 1690, 1696, 1690, 1690, 1665, 1577, 1690, 1665, 1652, 1652, 1654, 1692, 1652,
/* 1486 */ 1652, 1653, 1690, 1694, 1572, 1652, 1652, 1652, 1708, 1690, 1694, 1690, 1694, 1713, 1690, 1652, 1652, 1652,
/* 1504 */ 1707, 1708, 1572, 1663, 1652, 1652, 1652, 1652, 1652, 1657, 1690, 1697, 1573, 1690, 1696, 1572, 1572, 1572,
/* 1522 */ 1572, 1652, 1652, 1652, 1652, 1652, 1659, 1691, 1572, 2137, 2076, 1690, 1696, 1652, 1652, 1706, 2180, 1652,
/* 1540 */ 1652, 1652, 1652, 1652, 1652, 1865, 2198, 1841, 1572, 1572, 1682, 1572, 1572, 1572, 1572, 1785, 1785, 1785,
/* 1558 */ 1572, 1706, 1706, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 1572, 75, 1, 1, 1, 1, 1, 1, 1, 1, 8,
/* 1581 */ 1, 1, 1, 1, 1, 1, 1, 74, 1, 74, 1, 2, 3, 1, 2, 4, 1, 1, 5, 1, 1, 1, 1, 1, 8, 8, 8, 8, 8, 2, 6, 7, 1, 8, 9,
/* 1616 */ 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 22, 23, 24, 23, 23, 25, 25, 26, 27, 28, 29, 30, 31, 32,
/* 1643 */ 33, 34, 35, 36, 37, 36, 8, 1, 1, 8, 8, 8, 8, 8, 8, 8, 8, 74, 74, 74, 74, 74, 74, 74, 8, 8, 8, 8, 8, 8, 8, 8,
/* 1675 */ 8, 8, 8, 38, 8, 8, 8, 1, 1, 1, 8, 8, 8, 1, 1, 74, 74, 74, 74, 74, 74, 74, 74, 1, 1, 1, 1, 1, 1, 1, 39, 8, 8,
/* 1708 */ 8, 8, 8, 8, 8, 1, 1, 1, 1, 1, 1, 74, 74, 1, 8, 40, 8, 8, 41, 42, 43, 44, 45, 1, 46, 47, 48, 49, 50, 51, 52,
/* 1739 */ 53, 54, 8, 55, 56, 57, 58, 59, 60, 8, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 1, 74, 74, 74,
/* 1767 */ 74, 8, 8, 1, 1, 1, 1, 8, 8, 1, 8, 8, 8, 8, 8, 8, 8, 8, 1, 8, 8, 8, 8, 8, 8, 1, 8, 1, 1, 1, 8, 8, 1, 74, 74,
/* 1802 */ 74, 74, 74, 1, 74, 74, 1, 1, 74, 74, 74, 74, 74, 74, 1, 74, 1, 1, 74, 74, 1, 74, 74, 1, 74, 74, 8, 1, 1, 74,
/* 1832 */ 74, 74, 74, 74, 8, 8, 74, 8, 8, 8, 74, 8, 1, 1, 1, 1, 1, 1, 74, 74, 74, 1, 1, 8, 8, 8, 1, 8, 8, 8, 8, 74, 74,
/* 1865 */ 74, 8, 74, 74, 74, 8, 8, 74, 1, 74, 74, 74, 1, 8, 8, 8, 1, 8, 1, 8, 8, 8, 1, 8, 1, 1, 1, 8, 8, 1, 1, 1, 1, 1,
/* 1899 */ 8, 8, 1, 1, 74, 8, 74, 74, 1, 1, 8, 8, 1, 1, 1, 1, 74, 74, 74, 74, 74, 1, 8, 8, 1, 1, 74, 1, 74, 74, 74, 74,
/* 1931 */ 8, 1, 1, 74, 1, 1, 1, 1, 1, 1, 8, 8, 8, 8, 74, 74, 74, 1, 1, 1, 1, 8, 8, 74, 74, 8, 8, 8, 74, 1, 1, 1, 1, 1,
/* 1965 */ 1, 1, 74, 8, 1, 8, 8, 8, 8, 1, 8, 1, 1, 8, 8, 1, 8, 1, 8, 8, 1, 8, 8, 1, 8, 8, 8, 8, 1, 1, 1, 1, 8, 1, 8, 8,
/* 2001 */ 1, 1, 1, 8, 74, 74, 1, 74, 74, 74, 1, 1, 1, 74, 74, 1, 1, 74, 74, 1, 8, 8, 8, 8, 8, 1, 1, 8, 8, 1, 1, 74, 74,
/* 2034 */ 1, 1, 1, 1, 8, 8, 74, 1, 1, 74, 74, 74, 8, 1, 8, 74, 8, 8, 74, 74, 74, 74, 8, 8, 8, 1, 1, 8, 74, 74, 1, 8, 8,
/* 2067 */ 1, 8, 1, 1, 8, 1, 1, 74, 74, 8, 8, 8, 8, 74, 74, 1, 1, 1, 1, 74, 74, 74, 74, 74, 74, 8, 74, 74, 74, 74, 74,
/* 2098 */ 1, 1, 74, 8, 1, 74, 74, 1, 1, 1, 1, 8, 1, 1, 1, 1, 8, 1, 8, 1, 8, 1, 8, 74, 74, 74, 1, 74, 74, 74, 74, 1, 1,
/* 2131 */ 1, 8, 8, 8, 74, 8, 8, 8, 8, 74, 8, 8, 8, 8, 8, 8, 1, 74, 1, 1, 1, 74, 74, 74, 1, 1, 8, 8, 1, 1, 8, 8, 8, 8,
/* 2165 */ 1, 1, 1, 74, 74, 1, 1, 8, 8, 8, 8, 1, 8, 74, 74, 1, 1, 8, 74, 1, 1, 1, 1, 8, 1, 1, 74, 1, 1, 1, 1, 74, 74,
/* 2198 */ 74, 8, 8, 8, 8, 8, 74, 74, 1, 1, 74, 74, 74, 1, 1, 1, 1, 74
};

const int Java::MAP2[] =
{
/*   0 */ 57344, 63744, 64046, 64048, 64110, 64112, 64218, 64256, 64263, 64275, 64280, 64285, 64286, 64287, 64297,
/*  15 */ 64298, 64311, 64312, 64317, 64318, 64319, 64320, 64322, 64323, 64325, 64326, 64434, 64467, 64830, 64848,
/*  30 */ 64912, 64914, 64968, 65008, 65021, 65024, 65040, 65056, 65063, 65075, 65077, 65101, 65104, 65129, 65130,
/*  45 */ 65136, 65141, 65142, 65277, 65279, 65280, 65284, 65285, 65296, 65306, 65313, 65339, 65343, 65344, 65345,
/*  60 */ 65371, 65382, 65471, 65474, 65480, 65482, 65488, 65490, 65496, 65498, 65501, 65504, 65506, 65509, 65511,
/*  75 */ 65529, 65532, 65536, 63743, 64045, 64047, 64109, 64111, 64217, 64255, 64262, 64274, 64279, 64284, 64285,
/*  90 */ 64286, 64296, 64297, 64310, 64311, 64316, 64317, 64318, 64319, 64321, 64322, 64324, 64325, 64433, 64466,
/* 105 */ 64829, 64847, 64911, 64913, 64967, 65007, 65020, 65023, 65039, 65055, 65062, 65074, 65076, 65100, 65103,
/* 120 */ 65128, 65129, 65135, 65140, 65141, 65276, 65278, 65279, 65283, 65284, 65295, 65305, 65312, 65338, 65342,
/* 135 */ 65343, 65344, 65370, 65381, 65470, 65473, 65479, 65481, 65487, 65489, 65495, 65497, 65500, 65503, 65505,
/* 150 */ 65508, 65510, 65528, 65531, 65533, 1114111, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 74, 8, 1, 8, 1, 8, 1, 8, 1, 8,
/* 178 */ 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 74, 1, 74, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 74, 1, 8, 1, 74, 1, 8, 1,
/* 213 */ 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 74, 1, 1
};

const int Java::INITIAL[] =
{
/*   0 */ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
/*  30 */ 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
/*  57 */ 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
/*  84 */ 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
/* 109 */ 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129
};

const int Java::TRANSITION[] =
{
/*     0 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*    15 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*    30 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*    45 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*    60 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 5591, 8695, 5268, 7033,
/*    76 */ 4864, 5240, 10022, 5594, 5103, 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862, 5872, 7031, 6145,
/*    93 */ 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913,
/*   110 */ 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*   126 */ 11992, 11992, 4986, 4986, 4986, 4986, 4986, 4986, 4986, 4986, 5024, 8695, 5268, 7033, 4864, 5240, 10022,
/*   143 */ 5594, 5103, 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327,
/*   160 */ 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685,
/*   177 */ 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*   192 */ 4986, 4986, 4986, 4986, 4986, 4986, 4986, 4986, 5000, 8695, 5268, 7033, 5326, 5240, 10022, 5594, 5008, 4918,
/*   210 */ 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897,
/*   227 */ 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 6934, 4934, 5508, 5044, 11992, 11992,
/*   244 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 5080, 5080, 5080, 5080,
/*   260 */ 5080, 5080, 5080, 5080, 5095, 8695, 5268, 7033, 5326, 5240, 10022, 5594, 5008, 4918, 5595, 5054, 5271, 6243,
/*   278 */ 12634, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016,
/*   295 */ 5873, 6134, 11992, 5869, 6928, 10030, 4913, 6934, 4934, 5508, 5044, 11992, 11992, 11992, 11992, 11992,
/*   311 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 9157,
/*   326 */ 11992, 11992, 5591, 8695, 5268, 7033, 4864, 5240, 10022, 5594, 5103, 4918, 5595, 5054, 5271, 6243, 12634,
/*   343 */ 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134,
/*   361 */ 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*   377 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 7843, 5119, 5133, 5149,
/*   393 */ 8695, 5268, 7033, 4864, 5240, 10022, 5594, 5103, 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862,
/*   410 */ 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869,
/*   427 */ 6928, 10030, 4913, 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*   443 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 13700, 5173, 4970, 5187, 8695, 5268,
/*   459 */ 7033, 5213, 5240, 10022, 5594, 5103, 4918, 5595, 5054, 5271, 6243, 5256, 7029, 4892, 5862, 5872, 7031, 6145,
/*   477 */ 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913,
/*   494 */ 5696, 5287, 11218, 5312, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*   510 */ 11992, 11992, 11991, 12079, 11994, 10377, 11803, 12073, 6407, 12058, 12295, 9342, 11843, 8228, 5343, 8231,
/*   526 */ 12497, 6413, 5351, 6414, 6414, 14280, 11846, 8230, 11993, 8224, 14509, 8949, 6414, 8226, 9414, 12066, 11992,
/*   543 */ 12113, 8529, 6414, 14514, 9344, 11989, 12110, 6410, 6414, 8278, 11992, 6404, 12299, 7146, 5367, 11522, 5389,
/*   560 */ 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*   575 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 14401, 5414, 5591, 8695, 5268, 7033, 4864, 5240, 10022,
/*   591 */ 5594, 5103, 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327,
/*   608 */ 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685,
/*   625 */ 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*   640 */ 11992, 11992, 11992, 11992, 11992, 11992, 15004, 5451, 5591, 8695, 5268, 7033, 4864, 7681, 5496, 5594, 5103,
/*   657 */ 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595,
/*   674 */ 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685, 4959, 11992,
/*   691 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*   706 */ 11992, 11992, 11992, 12391, 5536, 5524, 5552, 8695, 5268, 7033, 8987, 5240, 10022, 5594, 5103, 4918, 5595,
/*   723 */ 5054, 5271, 6243, 5578, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 7151, 5327, 4876, 5595, 4897, 8697, 6247,
/*   741 */ 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562, 5611, 8685, 4959, 11992, 11992, 11992, 11992,
/*   758 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 5477, 11500, 11992, 5642, 5636, 5464,
/*   774 */ 5670, 5658, 5686, 8695, 5268, 7033, 4864, 5240, 10022, 5594, 5103, 4918, 5595, 5054, 5271, 6243, 12634,
/*   791 */ 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134,
/*   809 */ 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*   825 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 5714, 8412, 5756, 12015, 12015, 5712, 5730, 5744, 5591,
/*   841 */ 8695, 5268, 7033, 4864, 5240, 10022, 5594, 5103, 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862,
/*   858 */ 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869,
/*   875 */ 6928, 10030, 4913, 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*   891 */ 11992, 11992, 11992, 11992, 11992, 5774, 5773, 11992, 11992, 11992, 11992, 15174, 5790, 7646, 8695, 5268,
/*   907 */ 7033, 4864, 5240, 8673, 5594, 5157, 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5991, 5872, 7031, 6145,
/*   925 */ 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913,
/*   942 */ 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*   958 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 9014, 5820, 5834, 5850, 8695, 5268, 7033, 4864, 7656, 9600,
/*   975 */ 5594, 5103, 4918, 5595, 5054, 5271, 6243, 8355, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876,
/*   993 */ 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685, 4959,
/*  1010 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  1025 */ 10568, 5903, 5889, 5933, 11992, 10568, 5922, 5591, 8695, 5268, 7033, 4864, 5240, 10022, 5594, 5103, 4918,
/*  1042 */ 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897,
/*  1059 */ 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685, 4959, 11992, 11992,
/*  1076 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  1091 */ 11992, 11992, 9905, 5949, 5963, 5979, 8695, 5268, 7033, 4864, 5223, 11914, 5594, 5103, 4918, 5595, 5054,
/*  1108 */ 5271, 6243, 8355, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324,
/*  1126 */ 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992,
/*  1143 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 6041, 13467, 6032, 6044, 6041, 14975, 6060,
/*  1159 */ 6076, 6091, 8695, 5268, 7033, 6119, 5240, 6161, 5594, 5103, 4918, 5595, 5054, 5271, 6243, 10186, 7088, 4892,
/*  1177 */ 5862, 5872, 7031, 6145, 5233, 11992, 11359, 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992,
/*  1194 */ 5869, 6928, 10030, 4913, 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  1210 */ 11992, 11992, 11992, 11992, 11992, 11992, 6202, 6202, 6202, 6202, 6202, 6202, 6212, 6189, 6228, 8695, 5268,
/*  1227 */ 7033, 4864, 5240, 11206, 5594, 5103, 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 6103, 5872, 7031,
/*  1244 */ 6145, 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030,
/*  1261 */ 4913, 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  1277 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 13804, 6278, 6266, 6294, 9342, 11843, 8228, 6314,
/*  1293 */ 8231, 12497, 6413, 5351, 6414, 6414, 14280, 11846, 8230, 6338, 8224, 14509, 8949, 6414, 8226, 9414, 12066,
/*  1310 */ 7976, 6397, 8529, 6414, 14514, 9344, 11989, 6432, 6410, 6414, 8278, 12823, 6404, 12299, 11417, 6458, 11522,
/*  1327 */ 5389, 8519, 6480, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  1343 */ 11992, 11992, 11992, 11992, 11992, 11992, 12237, 6530, 6518, 6546, 9342, 11843, 8228, 6314, 8231, 12497,
/*  1359 */ 6413, 5351, 6414, 6414, 14280, 11846, 8230, 6338, 8224, 14509, 8949, 6414, 8226, 9414, 12066, 14764, 6397,
/*  1376 */ 8529, 6414, 14514, 9344, 11989, 6566, 6410, 6414, 8278, 9799, 6404, 12299, 11417, 6458, 11522, 5389, 8519,
/*  1393 */ 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  1408 */ 11992, 11992, 11992, 11992, 11992, 12237, 6530, 6518, 6546, 9342, 11843, 8228, 6314, 8231, 12497, 6413,
/*  1424 */ 5351, 6414, 6414, 14280, 11846, 8230, 6592, 8224, 14509, 8949, 6414, 8226, 9414, 12066, 14764, 6643, 8529,
/*  1441 */ 6414, 14514, 9344, 11989, 6666, 6410, 6414, 8278, 9799, 6404, 12299, 11417, 6458, 11522, 5389, 8519, 9777,
/*  1458 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  1473 */ 11992, 11992, 11992, 11992, 12237, 6530, 6518, 6546, 9342, 11843, 8228, 6314, 8231, 12497, 6413, 5351, 6414,
/*  1490 */ 6414, 14280, 11846, 8230, 6701, 8224, 14509, 8949, 6414, 8226, 9414, 12066, 14764, 6643, 8529, 6414, 14514,
/*  1507 */ 9344, 11989, 6666, 6410, 6414, 8278, 9799, 6404, 12299, 11417, 6458, 11522, 5389, 8519, 9777, 11992, 11992,
/*  1524 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  1539 */ 11992, 11992, 12237, 6530, 6518, 6546, 9342, 11843, 8228, 6314, 8231, 12497, 6413, 5351, 6414, 6414, 14280,
/*  1556 */ 11846, 8230, 6701, 8224, 14509, 8949, 6414, 8226, 9414, 12066, 14764, 6643, 8529, 6414, 14514, 9344, 11989,
/*  1573 */ 6666, 6410, 6414, 8278, 8876, 6404, 12299, 8564, 6458, 11522, 5389, 8519, 6739, 11992, 11992, 11992, 11992,
/*  1590 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  1605 */ 12237, 6530, 6518, 6546, 9342, 11843, 8228, 6767, 8231, 12497, 6413, 5351, 6414, 6414, 14280, 11846, 8230,
/*  1622 */ 13729, 8224, 14509, 8949, 6414, 8226, 9414, 12066, 5435, 6643, 8529, 6414, 14514, 9344, 11989, 6666, 6410,
/*  1639 */ 6414, 8278, 9799, 6404, 12299, 11417, 6458, 11522, 5389, 8519, 9777, 11992, 11992, 11992, 11992, 11992,
/*  1655 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 12384, 11992, 11992, 11992, 14068, 11992,
/*  1670 */ 10216, 6791, 5591, 8695, 5268, 7033, 4864, 5240, 10022, 5594, 5103, 4918, 5595, 5054, 5271, 6243, 12634,
/*  1687 */ 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134,
/*  1705 */ 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  1721 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 5803, 5804, 6832, 6820, 6869, 10011, 6856, 6898, 6913,
/*  1737 */ 8695, 5268, 7033, 4864, 5240, 10022, 5594, 5103, 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862,
/*  1754 */ 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869,
/*  1771 */ 6928, 10030, 4913, 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  1787 */ 11992, 11992, 11992, 11992, 11992, 12228, 6804, 11992, 6751, 6950, 7939, 6994, 6981, 6965, 8695, 5268, 7033,
/*  1804 */ 4864, 5620, 14625, 5594, 5103, 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862, 5872, 7031, 6145,
/*  1821 */ 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913,
/*  1838 */ 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  1854 */ 11992, 11992, 13006, 11992, 13007, 13000, 12991, 11992, 8646, 8660, 5591, 8695, 5268, 7033, 4864, 5197,
/*  1870 */ 7010, 7026, 5103, 4918, 5595, 5054, 5271, 6243, 12634, 7029, 7049, 5862, 5872, 7031, 6145, 5233, 11992,
/*  1887 */ 5327, 6003, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562, 4934,
/*  1904 */ 8685, 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  1919 */ 11992, 9168, 11992, 11992, 9173, 7067, 7065, 9217, 9231, 5591, 8695, 5268, 7033, 4864, 5296, 7378, 7085,
/*  1936 */ 5103, 4918, 5595, 5054, 5271, 6243, 12634, 5028, 7104, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876,
/*  1953 */ 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685, 4959,
/*  1970 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  1985 */ 11992, 11992, 11992, 11992, 10463, 10449, 7120, 5591, 8695, 5268, 7033, 4864, 5240, 10022, 5594, 5103, 4918,
/*  2002 */ 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897,
/*  2019 */ 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685, 4959, 11992, 11992,
/*  2036 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 13086, 11068,
/*  2051 */ 7167, 13088, 7205, 7180, 7196, 7221, 8695, 5268, 7033, 4864, 5240, 10022, 5594, 5103, 4918, 5595, 5054,
/*  2068 */ 5271, 6243, 12634, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247,
/*  2085 */ 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992,
/*  2102 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11991, 12079, 11994, 10377, 11803,
/*  2117 */ 12073, 6407, 12058, 12295, 9342, 11843, 8228, 5343, 8231, 12497, 6413, 5351, 6414, 6414, 14280, 11846, 8230,
/*  2134 */ 10035, 8224, 14509, 8949, 6414, 8226, 9414, 12066, 5435, 7237, 8529, 6414, 14514, 9344, 11989, 7260, 6410,
/*  2151 */ 6414, 8278, 9799, 6404, 12299, 11417, 6458, 11522, 5389, 8519, 9777, 11992, 11992, 11992, 11992, 11992,
/*  2167 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11991, 12079, 11994, 10377, 11803, 12073,
/*  2182 */ 6407, 12058, 12295, 9342, 11843, 8228, 7293, 8231, 12497, 6413, 5351, 6414, 6414, 14280, 11846, 8230, 10035,
/*  2199 */ 8224, 14509, 8949, 6414, 8226, 9414, 12066, 5435, 7237, 8529, 6414, 14514, 9344, 11989, 7260, 6410, 6414,
/*  2216 */ 8278, 9799, 6404, 12299, 11417, 6458, 11522, 5389, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992,
/*  2232 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11991, 12079, 11994, 10377, 11803, 12073, 6407,
/*  2247 */ 12058, 12295, 9342, 11843, 8228, 5343, 8231, 12497, 6413, 5351, 6414, 6414, 14280, 11846, 8230, 10035, 8224,
/*  2264 */ 14509, 8949, 6414, 8226, 9414, 12066, 5435, 7237, 8529, 6414, 14514, 9344, 11989, 7260, 6410, 6414, 8278,
/*  2281 */ 9799, 6404, 12299, 8769, 7317, 11522, 7339, 8519, 7366, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  2297 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11991, 12079, 11994, 10377, 11803, 12073, 6407, 12058,
/*  2312 */ 12295, 9342, 11843, 8228, 7394, 8231, 12497, 6413, 5351, 6414, 6414, 14280, 11846, 8230, 11404, 8224, 14509,
/*  2329 */ 8949, 6414, 8226, 9414, 12066, 5435, 7418, 8529, 6414, 14514, 9344, 11989, 7260, 6410, 6414, 8278, 9799,
/*  2346 */ 6404, 12299, 11417, 6458, 11522, 5389, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  2362 */ 11992, 11992, 11992, 11992, 11992, 11992, 11991, 12079, 11994, 10377, 11803, 12073, 6407, 12058, 12295,
/*  2377 */ 9342, 11843, 8228, 7441, 8231, 12497, 6413, 5351, 6414, 6414, 14280, 11846, 8230, 7133, 8224, 14509, 8949,
/*  2394 */ 6414, 8226, 9414, 12066, 5435, 7237, 8529, 6414, 14514, 9344, 11989, 7260, 6410, 6414, 8278, 9799, 6404,
/*  2411 */ 12299, 11417, 6458, 11522, 5389, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  2427 */ 11992, 11992, 11992, 11992, 11992, 11991, 12079, 11994, 10377, 11803, 12073, 6407, 12058, 12295, 9342,
/*  2442 */ 11843, 8228, 7465, 8231, 12497, 6413, 5351, 6414, 6414, 14280, 11846, 8230, 9869, 8224, 14509, 8949, 6414,
/*  2459 */ 8226, 9414, 12066, 11992, 7489, 8529, 6414, 14514, 9344, 11989, 12110, 6410, 6414, 8278, 11992, 6404, 12299,
/*  2476 */ 7146, 5367, 11522, 5389, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  2492 */ 11992, 11992, 11992, 11992, 11991, 12079, 11994, 10377, 11803, 12073, 6407, 12058, 12295, 9342, 11843, 8228,
/*  2508 */ 5343, 8231, 12497, 6413, 5351, 6414, 6414, 14280, 11846, 8230, 11993, 8224, 14509, 8949, 6414, 8226, 9414,
/*  2525 */ 12066, 11992, 9244, 8529, 6414, 14514, 9344, 11989, 13507, 6410, 6414, 8278, 11992, 6404, 12299, 7146, 5367,
/*  2542 */ 11522, 5389, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  2558 */ 11992, 11992, 11991, 12079, 11994, 10377, 11803, 12073, 6407, 12058, 12295, 9342, 11843, 8228, 7516, 8231,
/*  2574 */ 12497, 6413, 5351, 6414, 6414, 14280, 11846, 8230, 11993, 8224, 14509, 8949, 6414, 8226, 9414, 12066, 11992,
/*  2591 */ 12113, 8529, 6414, 14514, 9344, 11989, 12110, 6410, 6414, 8278, 11992, 6404, 12299, 7146, 5367, 11522, 5389,
/*  2608 */ 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  2623 */ 11992, 9381, 11992, 7572, 7540, 7564, 11992, 7548, 7588, 5591, 8695, 5268, 7033, 4864, 5240, 10022, 5594,
/*  2640 */ 5103, 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876,
/*  2657 */ 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685, 4959,
/*  2674 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  2689 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 5591, 8695, 5268, 7033, 7617, 5240, 10022, 5594, 5103,
/*  2705 */ 4918, 5595, 5054, 5271, 6243, 7633, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897,
/*  2723 */ 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 8997, 7672, 6173, 7697, 11992, 11992,
/*  2740 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 10879, 11992, 11992,
/*  2755 */ 11992, 11992, 11992, 7725, 7739, 5591, 8695, 5268, 7033, 4864, 5240, 10022, 5594, 5103, 4918, 5595, 5054,
/*  2772 */ 5271, 6243, 12634, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247,
/*  2789 */ 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992,
/*  2806 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  2821 */ 11992, 11332, 11346, 5591, 8695, 5268, 7033, 4864, 5240, 10022, 5594, 5103, 4918, 5595, 5054, 5271, 6243,
/*  2838 */ 12634, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016,
/*  2855 */ 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992,
/*  2871 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11991, 12079, 11994, 10377, 11803, 12073,
/*  2886 */ 6407, 12058, 12295, 9342, 11843, 8228, 7768, 8231, 12497, 6413, 5351, 6414, 6414, 14280, 11846, 8230, 7601,
/*  2903 */ 8224, 14509, 8949, 6414, 8226, 9414, 12066, 11992, 7793, 8529, 6414, 14514, 9344, 11989, 7816, 6410, 6414,
/*  2920 */ 8278, 5757, 6404, 12299, 7146, 5367, 11522, 5389, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992,
/*  2936 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 7842, 13584, 7069, 13594, 12707, 7870, 7859, 12721,
/*  2952 */ 7886, 9471, 7930, 7955, 7992, 8028, 10678, 8044, 8109, 8135, 9251, 8153, 13408, 8178, 10035, 8194, 14543,
/*  2969 */ 11562, 8221, 9494, 8072, 8247, 7709, 7237, 15244, 8263, 8306, 10301, 8477, 8334, 8006, 8371, 10734, 9799,
/*  2986 */ 8389, 14247, 11417, 6458, 11522, 5389, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  3002 */ 11992, 11992, 11992, 11992, 11992, 11992, 8411, 14098, 13119, 14108, 14022, 14036, 14047, 8428, 8443, 9342,
/*  3018 */ 11843, 7425, 8464, 8231, 12497, 8493, 5351, 6414, 7270, 14280, 11846, 13992, 8551, 9462, 14509, 11137, 6414,
/*  3035 */ 8226, 9414, 8580, 5435, 7237, 8529, 6414, 14514, 9344, 11989, 7260, 6410, 6414, 8278, 9799, 6404, 12299,
/*  3052 */ 11417, 6458, 11522, 8605, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  3068 */ 11992, 11992, 11992, 11992, 8632, 9698, 10939, 9708, 10749, 10763, 10777, 10791, 8713, 9342, 11843, 8228,
/*  3084 */ 5343, 8231, 12497, 6413, 5351, 6414, 11954, 14280, 8733, 8230, 8756, 8224, 14509, 14149, 6414, 12525, 8506,
/*  3101 */ 12066, 7752, 7237, 8785, 8807, 9559, 9344, 15420, 8826, 8395, 10057, 8842, 8892, 9444, 8908, 14455, 8937,
/*  3118 */ 8975, 7339, 8519, 7366, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  3134 */ 11992, 11992, 9013, 10332, 9030, 10342, 9039, 9055, 9066, 9082, 9097, 9342, 11843, 8228, 7394, 8231, 12497,
/*  3151 */ 6413, 5351, 6414, 6414, 14280, 11846, 8230, 11404, 8224, 14509, 8949, 6414, 15369, 9414, 13767, 5435, 7418,
/*  3168 */ 8529, 6414, 14514, 9344, 11989, 7260, 6410, 13966, 12187, 9799, 6404, 12299, 11417, 6458, 11522, 5389, 9119,
/*  3185 */ 9145, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  3200 */ 10567, 10556, 13058, 9203, 9189, 9278, 9267, 9294, 9309, 10122, 9372, 9630, 9325, 9360, 12497, 9397, 9430,
/*  3217 */ 6414, 6414, 14280, 11846, 8230, 7133, 8224, 9487, 11728, 9510, 10435, 9533, 9879, 5435, 9549, 10978, 9575,
/*  3234 */ 15322, 12568, 8347, 9616, 13681, 6414, 10525, 9799, 9649, 10653, 9683, 9724, 9762, 9815, 9831, 9857, 11992,
/*  3251 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 9904, 13353,
/*  3266 */ 14480, 13363, 11009, 11023, 11037, 11051, 9921, 8589, 11843, 11983, 9943, 8231, 6685, 9970, 5351, 14591,
/*  3282 */ 6414, 8162, 11846, 8230, 9986, 8224, 14509, 10051, 6414, 8226, 9414, 12066, 5435, 7418, 8529, 6414, 14514,
/*  3299 */ 9344, 11989, 7260, 6410, 7473, 10073, 9799, 6404, 6627, 13036, 10138, 11522, 8605, 10086, 10174, 11992,
/*  3315 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 10215, 13903,
/*  3330 */ 13554, 10202, 10252, 13909, 10232, 10244, 10268, 9342, 11843, 8228, 5343, 8231, 12497, 6413, 5351, 6414,
/*  3346 */ 6414, 14280, 11846, 8230, 11993, 8224, 14509, 8949, 8958, 8226, 9414, 10290, 11992, 12113, 8529, 6414,
/*  3362 */ 14514, 9344, 11989, 12110, 6410, 7496, 11274, 6492, 6404, 12299, 7146, 5367, 11522, 5389, 8519, 9777, 11992,
/*  3379 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11991, 12079,
/*  3394 */ 11994, 10377, 11803, 12073, 6407, 12058, 6716, 10317, 10405, 10370, 10358, 10393, 12497, 10421, 10483, 6414,
/*  3410 */ 6414, 14280, 11846, 8230, 11993, 8224, 14509, 8949, 6414, 8226, 9414, 12066, 11992, 12113, 8529, 8958, 9667,
/*  3427 */ 8854, 10814, 12110, 10510, 6414, 8278, 11992, 6650, 12299, 7146, 5367, 11522, 5389, 8519, 9777, 11992,
/*  3443 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 10541, 15205,
/*  3458 */ 11463, 15215, 10584, 10598, 10612, 10626, 10642, 9342, 10669, 13849, 10694, 9633, 12497, 10719, 13525, 6414,
/*  3474 */ 14171, 10807, 10830, 7826, 11993, 8119, 15293, 8949, 7402, 10853, 9414, 12066, 10873, 8740, 10895, 9517,
/*  3490 */ 12879, 10918, 14362, 12900, 14238, 6414, 10955, 7968, 10703, 12299, 7146, 5367, 11522, 10994, 10968, 9777,
/*  3506 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11991,
/*  3521 */ 12079, 11994, 10377, 11803, 12073, 6407, 12058, 12295, 9342, 11843, 8228, 5343, 8231, 12497, 6413, 5351,
/*  3537 */ 6414, 6414, 14280, 11846, 8230, 11993, 8224, 14509, 8949, 13972, 8226, 11443, 12066, 6502, 12113, 8529,
/*  3553 */ 8959, 14514, 9344, 11989, 12110, 13206, 6414, 8278, 11992, 6404, 12299, 7146, 5367, 11522, 5389, 8519, 9777,
/*  3570 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11067,
/*  3585 */ 11084, 14643, 11094, 11110, 11166, 11177, 11153, 11125, 11798, 11193, 11234, 11259, 12530, 12497, 11303,
/*  3600 */ 14137, 6775, 14959, 14280, 11846, 14968, 11375, 11391, 14509, 11550, 12476, 8012, 13322, 11433, 11459,
/*  3615 */ 11479, 8616, 8717, 14514, 8290, 11495, 12110, 5373, 6620, 15400, 11992, 6404, 11516, 9999, 11538, 11522,
/*  3631 */ 5389, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  3647 */ 11992, 11991, 12079, 11994, 10377, 11803, 12073, 6407, 12058, 6368, 9888, 11578, 6375, 11603, 8231, 15120,
/*  3663 */ 11875, 5351, 6414, 6414, 14280, 11846, 8230, 11993, 8224, 14509, 13218, 6414, 8226, 9414, 13417, 11992,
/*  3679 */ 10837, 8529, 6414, 14514, 9344, 11989, 12110, 6410, 10148, 11318, 11992, 7244, 12299, 7146, 5367, 11522,
/*  3695 */ 5389, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  3711 */ 11992, 11619, 11646, 14782, 11656, 11630, 11672, 11686, 11700, 11716, 12557, 8318, 11903, 11754, 12085,
/*  3726 */ 5064, 11770, 14160, 11786, 11819, 12740, 11862, 12265, 13242, 7277, 11891, 15071, 6414, 9406, 9414, 12066,
/*  3742 */ 5427, 12113, 11930, 11959, 14514, 14835, 11989, 12110, 6410, 11975, 8278, 11992, 10902, 12299, 12010, 12031,
/*  3758 */ 12951, 12047, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  3773 */ 11992, 11992, 11992, 11991, 12079, 11994, 10377, 11803, 12073, 6407, 12058, 7901, 14277, 15095, 12101,
/*  3788 */ 12129, 15083, 12497, 12172, 14225, 8791, 9735, 14280, 13271, 12216, 11993, 15254, 14509, 8949, 13954, 9335,
/*  3804 */ 13446, 12066, 9789, 12113, 7350, 6414, 14514, 9344, 11989, 12110, 6410, 6414, 8278, 11992, 6404, 10274,
/*  3820 */ 12813, 12253, 11522, 12281, 10099, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  3835 */ 11992, 11992, 11992, 11992, 11992, 12326, 12315, 14902, 12343, 12407, 12448, 12437, 12421, 12464, 9342,
/*  3850 */ 11843, 8228, 5343, 8231, 12497, 6413, 5351, 8810, 9103, 11287, 11846, 8230, 12492, 8224, 12513, 8949, 6414,
/*  3867 */ 8226, 9414, 12066, 11992, 9244, 8529, 6414, 14514, 9344, 11989, 13507, 6410, 6414, 8278, 11992, 6404, 12299,
/*  3884 */ 7146, 5367, 13230, 12546, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  3900 */ 11992, 11992, 11992, 11992, 12633, 12584, 15668, 12620, 12606, 12590, 12650, 12662, 12678, 12737, 12891,
/*  3915 */ 12756, 12772, 12800, 11243, 12839, 12867, 8954, 7800, 12979, 12916, 10857, 13242, 7301, 12939, 8949, 8137,
/*  3931 */ 8226, 9414, 12967, 11992, 12113, 8529, 12851, 10494, 13023, 15351, 14372, 13300, 6298, 8278, 13052, 10158,
/*  3947 */ 12299, 7146, 5367, 11522, 8605, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  3963 */ 11992, 11992, 11992, 11992, 11992, 13117, 13074, 6250, 13104, 13135, 13149, 13163, 13177, 13193, 9342,
/*  3978 */ 11843, 8228, 13258, 8231, 12497, 13287, 6322, 7500, 6414, 8085, 15033, 14756, 11993, 13338, 13379, 13395,
/*  3994 */ 6414, 9927, 15264, 12066, 11992, 15448, 9841, 6414, 6723, 8205, 6381, 12110, 13433, 6415, 12693, 11992,
/*  4010 */ 6404, 12299, 13462, 5367, 11522, 5389, 8921, 13483, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  4026 */ 11992, 11992, 11992, 11992, 11992, 11992, 13552, 13541, 6882, 13570, 13610, 13624, 13638, 13652, 13668,
/*  4041 */ 13716, 11843, 6442, 13745, 13783, 12497, 13516, 13820, 7777, 13836, 13888, 7914, 9589, 13242, 13312, 13925,
/*  4057 */ 13941, 9746, 13988, 14008, 15042, 14063, 12923, 12784, 8957, 8535, 8093, 14084, 12110, 14124, 6550, 8278,
/*  4073 */ 14187, 14212, 7524, 13796, 14263, 5398, 14296, 14351, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  4089 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11991, 12079, 11994, 10377, 11803, 12073, 6407, 12058,
/*  4104 */ 6353, 14388, 10930, 6576, 14417, 14442, 11587, 9453, 14426, 11942, 8373, 14280, 11832, 14471, 14496, 14824,
/*  4120 */ 14811, 8949, 11738, 8226, 9414, 12066, 6840, 12113, 9129, 14597, 14514, 14530, 11989, 14559, 6464, 6414,
/*  4136 */ 8278, 11992, 6404, 14335, 7146, 14578, 11522, 5389, 10112, 14613, 11992, 11992, 11992, 11992, 11992, 11992,
/*  4152 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 14641, 14659, 5480, 14669, 14685, 14699, 14713,
/*  4167 */ 14727, 14743, 9342, 11843, 8228, 5343, 8231, 12497, 6413, 5351, 6414, 6414, 14280, 11846, 8230, 11993, 8224,
/*  4184 */ 14509, 8949, 8448, 8226, 9414, 12066, 14780, 14562, 8529, 6414, 14798, 9344, 13694, 14196, 6410, 6414, 8278,
/*  4201 */ 11992, 6404, 12299, 7146, 5367, 11522, 5389, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  4217 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 14900, 14851, 5906, 14887, 14873, 14857, 14918, 14930,
/*  4232 */ 14946, 14991, 11843, 6676, 15020, 12143, 12497, 9658, 15058, 6414, 11735, 15413, 13758, 8230, 11993, 8224,
/*  4248 */ 14509, 8949, 6414, 8226, 9414, 12066, 11992, 12113, 8529, 6414, 7449, 14309, 11989, 12110, 7323, 6414, 8278,
/*  4265 */ 11992, 6404, 12299, 7146, 5367, 11522, 5389, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  4281 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11991, 12079, 11994, 10377, 11803, 12073, 6407, 12058,
/*  4296 */ 6607, 9342, 15111, 8228, 15136, 8231, 12497, 6413, 15145, 6414, 6414, 14280, 11846, 8230, 11993, 8224,
/*  4312 */ 14509, 8949, 6414, 8226, 9414, 12066, 11992, 12113, 8529, 6414, 14514, 9344, 11989, 12110, 6410, 6414, 8278,
/*  4329 */ 11992, 6404, 12299, 7146, 5367, 11522, 5389, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  4345 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11991, 12079, 11994, 10377, 11803, 12073, 6407, 12058,
/*  4360 */ 8059, 15161, 8866, 15190, 15231, 15280, 12497, 15309, 15338, 6414, 6416, 14280, 11846, 8230, 11993, 15367,
/*  4376 */ 12156, 8949, 6414, 8226, 9414, 12066, 11992, 12113, 8529, 6414, 14514, 9344, 11989, 12110, 6410, 6414, 8278,
/*  4393 */ 11992, 6404, 9954, 7146, 15385, 11522, 5389, 8519, 9777, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  4409 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11991, 12079, 11994, 10377, 11803, 12073, 6407, 12058,
/*  4424 */ 12295, 9342, 11843, 8228, 5343, 8231, 12497, 6413, 5351, 6414, 6414, 14280, 11846, 8230, 11993, 8224, 14509,
/*  4441 */ 8949, 6414, 8226, 9414, 12066, 11992, 12113, 8529, 6414, 14514, 9344, 11989, 12110, 6410, 6414, 8278, 11992,
/*  4458 */ 6404, 12299, 7146, 5367, 11522, 5389, 12200, 15436, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  4474 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 15470, 15475, 13495, 15464, 11992, 15491, 15505, 15521,
/*  4489 */ 8695, 5268, 7033, 4864, 5240, 10022, 5594, 5103, 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862,
/*  4506 */ 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869,
/*  4523 */ 6928, 10030, 4913, 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  4539 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 12357, 12371, 5591, 8695, 5268,
/*  4555 */ 7033, 4864, 4943, 13872, 5594, 5103, 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862, 5872, 7031,
/*  4572 */ 6145, 5233, 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030,
/*  4589 */ 4913, 5562, 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  4605 */ 11992, 11992, 11992, 11992, 15540, 15537, 15556, 15560, 10467, 15576, 15590, 15606, 8695, 5268, 7033, 4864,
/*  4621 */ 5240, 10022, 5594, 5103, 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862, 5872, 7031, 6145, 5233,
/*  4638 */ 11992, 5327, 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562,
/*  4655 */ 4934, 8685, 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  4671 */ 11992, 11992, 11992, 11992, 11992, 11992, 12327, 15634, 15622, 15650, 8695, 5268, 7033, 4864, 5240, 10022,
/*  4687 */ 5594, 5103, 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 5862, 5872, 7031, 6145, 5233, 11992, 5327,
/*  4704 */ 4876, 5595, 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 5562, 4934, 8685,
/*  4721 */ 4959, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992,
/*  4736 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 14322, 9342, 11843, 8228, 5343, 8231, 12497, 6413,
/*  4752 */ 5351, 6414, 6414, 14280, 11846, 8230, 11993, 8224, 14509, 8949, 6414, 8226, 9414, 12066, 11992, 12113, 8529,
/*  4769 */ 6414, 14514, 9344, 11989, 12110, 6410, 6414, 8278, 11992, 6404, 12299, 7146, 5367, 11522, 5389, 8519, 9777,
/*  4786 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 15666,
/*  4801 */ 11992, 11992, 11992, 11992, 13861, 11992, 11992, 5591, 8695, 5268, 7033, 5326, 5240, 10022, 5594, 4872,
/*  4817 */ 4918, 5595, 5054, 5271, 6243, 12634, 7029, 4892, 6015, 5872, 7031, 6145, 5233, 11992, 5327, 4876, 5595,
/*  4834 */ 4897, 8697, 6247, 5324, 6016, 5873, 6134, 11992, 5869, 6928, 10030, 4913, 6934, 4934, 5508, 5044, 11992,
/*  4851 */ 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 11992, 0, 0, 0, 196,
/*  4868 */ 357, 0, 0, 0, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 0, 136192, 136192, 136192,
/*  4885 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 0, 136192, 136192, 0, 136192, 136192, 136192,
/*  4900 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 0, 0, 0, 136192, 0, 0, 136192, 136192,
/*  4917 */ 136192, 136192, 136192, 136192, 136192, 0, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192,
/*  4931 */ 0, 136192, 136192, 0, 0, 136192, 136192, 136192, 136192, 136192, 136192, 0, 136192, 136192, 136192, 136192,
/*  4947 */ 136192, 136192, 0, 0, 0, 0, 0, 0, 0, 0, 108544, 136192, 196, 136192, 0, 136192, 136192, 0, 196, 136192, 0,
/*  4968 */ 196, 136192, 196, 0, 0, 0, 0, 196, 0, 0, 0, 0, 0, 0, 0, 196, 196, 196, 3072, 3072, 3072, 3072, 3072, 3072,
/*  4992 */ 3072, 3072, 3072, 3072, 3072, 3072, 3072, 3072, 3072, 3072, 136192, 0, 136192, 136192, 136192, 136192,
/*  5008 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 265, 0, 136192, 136192, 136192, 136192,
/*  5022 */ 136192, 136192, 3072, 0, 136192, 0, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192,
/*  5037 */ 136192, 136192, 136192, 136192, 48128, 0, 0, 0, 136192, 0, 136192, 136192, 0, 0, 136192, 0, 0, 136192, 0, 0,
/*  5057 */ 0, 0, 0, 0, 136192, 136192, 136192, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 388, 0, 131, 0, 0, 0, 3202, 3202, 3202,
/*  5083 */ 3202, 3202, 3202, 3202, 3202, 3202, 3202, 3202, 3202, 3202, 3202, 3202, 3202, 0, 136192, 0, 136192, 136192,
/*  5101 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 265, 4362, 136192, 136192,
/*  5115 */ 136192, 136192, 136192, 136192, 0, 13312, 13312, 13312, 13312, 0, 217, 13312, 13312, 13312, 0, 13312, 13312,
/*  5132 */ 13312, 13312, 217, 217, 0, 217, 13312, 217, 217, 217, 217, 217, 217, 217, 13312, 13312, 13312, 13312, 0,
/*  5151 */ 136192, 0, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192,
/*  5165 */ 405, 4362, 136192, 136192, 136192, 136192, 136192, 136192, 0, 196, 196, 196, 196, 0, 0, 196, 196, 196, 0,
/*  5184 */ 196, 196, 196, 196, 0, 136192, 0, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192,
/*  5200 */ 136192, 136192, 136192, 0, 0, 14336, 0, 40960, 43008, 45056, 0, 0, 136192, 0, 0, 0, 10240, 357, 0, 0, 0,
/*  5221 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 29696, 0, 0, 0, 0, 0, 0, 0, 136192,
/*  5239 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 0, 0, 0, 0, 0, 0, 0, 0, 136192, 0, 0, 0, 196, 0,
/*  5261 */ 357, 0, 0, 0, 0, 0, 0, 0, 0, 0, 136192, 136192, 136192, 0, 136192, 136192, 0, 0, 0, 0, 0, 0, 0, 0, 136192,
/*  5286 */ 136192, 0, 357, 136192, 136192, 136192, 136192, 136192, 136192, 0, 136192, 136192, 136192, 136192, 136192,
/*  5301 */ 136192, 0, 0, 0, 0, 0, 0, 46462, 0, 0, 136192, 10240, 136192, 0, 136192, 136192, 0, 10240, 136192, 0, 10240,
/*  5322 */ 136192, 10240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192,
/*  5342 */ 136192, 0, 0, 0, 196, 357, 0, 0, 0, 131, 131, 131, 131, 131, 131, 131, 131, 265, 4362, 131, 131, 131, 131,
/*  5365 */ 131, 131, 0, 0, 131, 131, 131, 131, 131, 131, 131, 0, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131,
/*  5388 */ 73394, 0, 0, 131, 131, 131, 131, 131, 131, 0, 131, 131, 131, 131, 131, 131, 0, 131, 0, 56320, 0, 0, 0, 0, 0,
/*  5413 */ 196, 0, 225, 225, 0, 15585, 0, 15585, 15585, 15585, 15585, 15585, 15585, 15585, 0, 0, 0, 0, 0, 0, 0, 589, 0,
/*  5436 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 594, 0, 0, 0, 597, 0, 17634, 17634, 0, 17634, 0, 17634, 17634, 17634, 17634,
/*  5461 */ 17634, 17634, 17634, 0, 0, 0, 0, 0, 0, 0, 20480, 0, 0, 0, 20480, 0, 0, 0, 20480, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/*  5489 */ 0, 0, 0, 0, 0, 147, 147, 0, 18432, 0, 0, 0, 0, 0, 0, 0, 0, 136192, 0, 136192, 0, 0, 0, 0, 0, 136192, 136192,
/*  5516 */ 136192, 0, 136192, 136192, 136192, 136192, 0, 0, 197, 0, 0, 0, 0, 197, 0, 0, 0, 0, 0, 0, 0, 197, 197, 197,
/*  5540 */ 197, 0, 0, 197, 197, 197, 0, 197, 197, 197, 197, 0, 197, 0, 136192, 0, 136192, 136192, 136192, 136192,
/*  5560 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 136192, 0, 0, 0, 0, 0, 0, 0, 196, 0, 0,
/*  5580 */ 0, 196, 9216, 357, 0, 0, 0, 0, 0, 0, 0, 0, 0, 136192, 0, 136192, 136192, 136192, 136192, 136192, 136192,
/*  5601 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 9573, 136192, 136192,
/*  5615 */ 136192, 136192, 136192, 136192, 0, 136192, 136192, 136192, 136192, 136192, 136192, 0, 0, 0, 0, 38912, 0, 0,
/*  5633 */ 0, 0, 136192, 0, 0, 0, 0, 0, 20480, 0, 0, 20480, 20480, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20480, 0, 20480, 0, 0,
/*  5661 */ 20480, 20480, 20480, 20480, 20480, 0, 0, 0, 20480, 0, 20480, 20480, 20480, 20480, 0, 20480, 20480, 20480,
/*  5679 */ 20480, 0, 20480, 20480, 20480, 20480, 0, 20480, 0, 136192, 0, 136192, 136192, 136192, 136192, 136192,
/*  5695 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 136192, 0, 0, 0, 0, 0, 0, 0, 10436, 0, 0, 0, 0,
/*  5716 */ 0, 21504, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21504, 0, 0, 0, 0, 21504, 0, 0, 0, 0, 21504, 0, 0, 0,
/*  5745 */ 21504, 21504, 21504, 0, 0, 0, 0, 21504, 21504, 21504, 21504, 21504, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/*  5770 */ 0, 0, 672, 0, 0, 0, 0, 0, 22528, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 227, 227, 0, 22755, 0, 22755, 22755,
/*  5798 */ 22755, 22755, 22755, 22755, 22755, 0, 0, 0, 0, 0, 0, 0, 36864, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24791, 24791,
/*  5823 */ 24791, 24791, 0, 24791, 24791, 24791, 24791, 0, 24791, 24791, 24791, 24791, 228, 228, 0, 24814, 24791,
/*  5840 */ 24814, 24814, 24814, 24804, 24814, 24814, 24814, 24791, 24791, 24791, 24791, 0, 136192, 0, 136192, 136192,
/*  5856 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 265, 136192, 136192, 136192,
/*  5870 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 136192, 136192, 136192, 136192, 136192,
/*  5884 */ 136192, 136192, 136192, 136192, 0, 0, 0, 0, 0, 27648, 27648, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27648, 27648, 0, 0,
/*  5908 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 148, 148, 27648, 27648, 27648, 27648, 0, 0, 27648, 0, 27648, 27648,
/*  5932 */ 27648, 27648, 27648, 0, 0, 0, 0, 27648, 0, 27648, 27648, 0, 0, 27648, 0, 0, 0, 0, 28888, 28888, 28888,
/*  5953 */ 28888, 0, 28888, 28888, 28888, 28888, 0, 28888, 28888, 28888, 28888, 229, 229, 0, 28911, 28888, 28911,
/*  5970 */ 28911, 28911, 28901, 28911, 28911, 28911, 28888, 28888, 28888, 28888, 0, 136192, 0, 136192, 136192, 136192,
/*  5986 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 405, 136192, 136192, 136192, 136192,
/*  6000 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 49152, 136192, 136192, 136192, 136192, 136192,
/*  6014 */ 136192, 136192, 136192, 136192, 136192, 0, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192,
/*  6028 */ 136192, 136192, 136192, 136192, 0, 0, 0, 31744, 31744, 0, 0, 0, 0, 0, 0, 0, 0, 0, 31744, 0, 0, 0, 0, 0, 0,
/*  6053 */ 0, 0, 0, 0, 0, 31744, 0, 0, 198, 198, 198, 198, 0, 31744, 31942, 198, 198, 0, 198, 31942, 198, 198, 230,
/*  6076 */ 198, 31974, 31974, 31744, 31744, 198, 31744, 31744, 0, 31744, 31744, 31744, 31744, 198, 198, 198, 0, 136192,
/*  6094 */ 0, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 4096,
/*  6108 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 0, 0, 196, 357,
/*  6124 */ 0, 7528, 7528, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 136192, 136192, 0, 0, 0,
/*  6141 */ 0, 0, 136192, 0, 0, 136192, 136192, 0, 0, 0, 0, 0, 0, 136192, 136192, 136192, 0, 136192, 0, 0, 0, 0, 0, 0,
/*  6165 */ 0, 384, 0, 0, 0, 0, 136192, 0, 136192, 0, 0, 0, 0, 774, 136192, 136192, 136192, 0, 136192, 136192, 136192,
/*  6186 */ 136192, 0, 0, 132, 231, 231, 132, 34023, 132, 34023, 34023, 34023, 34023, 34023, 34023, 34023, 132, 132,
/*  6204 */ 132, 132, 132, 132, 132, 132, 132, 132, 132, 132, 132, 132, 132, 132, 33924, 132, 132, 132, 132, 132, 132,
/*  6225 */ 132, 132, 231, 132, 0, 136192, 4362, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192,
/*  6241 */ 136192, 136192, 136192, 0, 136192, 136192, 136192, 136192, 136192, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/*  6264 */ 145, 145, 6343, 0, 0, 0, 0, 6343, 0, 0, 0, 0, 0, 0, 0, 6343, 6343, 6343, 6343, 0, 0, 6343, 6343, 6343, 0,
/*  6289 */ 6343, 6343, 6343, 6343, 0, 6343, 0, 131, 0, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131,
/*  6311 */ 131, 699, 131, 0, 0, 0, 196, 357, 7527, 6505, 6344, 131, 131, 131, 131, 131, 131, 131, 131, 265, 4362, 406,
/*  6333 */ 407, 131, 131, 131, 410, 0, 0, 0, 196, 0, 493, 7527, 7527, 6505, 362, 6643, 7669, 6647, 6505, 6344, 131, 0,
/*  6355 */ 131, 0, 131, 131, 131, 131, 131, 131, 131, 131, 131, 292, 295, 131, 0, 131, 0, 131, 131, 131, 131, 131, 131,
/*  6378 */ 131, 287, 131, 131, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 663, 0, 0, 0, 7527, 362, 6643, 7669, 7669, 600,
/*  6403 */ 6647, 131, 131, 131, 131, 131, 131, 131, 131, 131, 0, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131,
/*  6425 */ 131, 131, 131, 131, 131, 286, 131, 667, 668, 669, 670, 671, 6643, 7669, 600, 600, 6647, 131, 131, 131, 131,
/*  6446 */ 131, 131, 298, 131, 131, 0, 0, 0, 0, 0, 350, 0, 357, 357, 131, 131, 131, 131, 131, 131, 131, 0, 131, 131,
/*  6470 */ 131, 131, 131, 131, 131, 131, 131, 689, 131, 131, 791, 131, 0, 131, 131, 0, 794, 131, 0, 196, 131, 196, 0,
/*  6493 */ 0, 0, 0, 0, 0, 0, 0, 0, 717, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 592, 0, 0, 0, 0, 0, 6344, 0, 0, 0, 0, 6344, 0, 0,
/*  6526 */ 0, 0, 0, 0, 0, 6344, 6344, 6344, 6344, 0, 0, 6344, 6344, 6344, 0, 6344, 6344, 6344, 6344, 0, 6344, 0, 131,
/*  6549 */ 0, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 698, 131, 131, 668, 668, 0, 671, 671,
/*  6571 */ 6643, 7669, 600, 600, 6647, 131, 131, 131, 131, 131, 131, 299, 131, 131, 0, 0, 0, 0, 349, 0, 0, 0, 0, 0,
/*  6595 */ 196, 0, 493, 7527, 7527, 6505, 362, 0, 7669, 6647, 6505, 6344, 131, 0, 131, 0, 131, 131, 131, 131, 280, 131,
/*  6617 */ 131, 131, 131, 131, 131, 131, 537, 131, 693, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 740, 131,
/*  6638 */ 131, 0, 131, 0, 0, 7527, 362, 0, 7669, 7669, 600, 6647, 131, 131, 131, 131, 131, 131, 131, 131, 131, 0, 131,
/*  6661 */ 131, 131, 131, 131, 95518, 668, 668, 0, 671, 671, 0, 7669, 600, 600, 6647, 131, 131, 131, 131, 131, 131,
/*  6682 */ 300, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 286, 0, 131, 0, 0, 0, 0, 0, 0, 196, 0, 494, 7527, 7527, 6505,
/*  6710 */ 362, 0, 7669, 6647, 6505, 6344, 131, 0, 131, 0, 131, 131, 273, 131, 131, 131, 131, 131, 131, 131, 131, 131,
/*  6732 */ 641, 131, 64512, 0, 0, 0, 131, 196, 131, 0, 131, 131, 0, 196, 131, 0, 796, 131, 196, 0, 0, 0, 0, 0, 0, 0, 0,
/*  6759 */ 0, 37888, 0, 0, 0, 0, 37888, 0, 0, 0, 0, 196, 357, 7527, 362, 6344, 131, 131, 131, 131, 131, 131, 131, 131,
/*  6783 */ 278, 131, 131, 131, 131, 131, 131, 131, 0, 35840, 35840, 0, 35840, 0, 0, 35840, 35840, 35840, 35840, 35840,
/*  6803 */ 35840, 0, 0, 0, 0, 0, 0, 0, 37888, 0, 0, 0, 0, 0, 37888, 0, 0, 0, 0, 0, 0, 36864, 0, 36864, 36864, 36864, 0,
/*  6830 */ 0, 0, 0, 36864, 0, 36864, 0, 36864, 36864, 36864, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 492, 0, 0, 595, 496, 0,
/*  6857 */ 0, 36864, 0, 0, 36864, 0, 0, 0, 0, 36864, 0, 0, 36864, 0, 36864, 0, 0, 0, 36864, 0, 36864, 36864, 0, 0,
/*  6881 */ 36864, 0, 0, 0, 0, 0, 0, 159, 0, 0, 0, 0, 0, 0, 159, 146, 146, 0, 36864, 36864, 36864, 36864, 36864, 36864,
/*  6905 */ 36864, 36864, 36864, 36864, 36864, 36864, 36864, 36864, 36864, 0, 136192, 0, 136192, 136192, 136192, 136192,
/*  6921 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 136192, 136192, 136192, 136192, 136192,
/*  6935 */ 136192, 136192, 136192, 136192, 136192, 0, 136192, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 37888, 37888, 37888, 0,
/*  6957 */ 37888, 0, 0, 37888, 37888, 0, 0, 0, 37888, 0, 136192, 0, 136192, 136192, 136192, 136192, 136192, 136192,
/*  6975 */ 136192, 136192, 136192, 136192, 136192, 136192, 37888, 232, 38120, 37888, 38128, 37888, 38128, 38128, 38128,
/*  6990 */ 38128, 38128, 38128, 38128, 37888, 37888, 37888, 37888, 37888, 37888, 38107, 37888, 37888, 37888, 37888,
/*  7005 */ 37888, 37888, 37888, 37888, 232, 16384, 19456, 23552, 26624, 30720, 0, 34816, 0, 0, 55296, 136192, 107520,
/*  7022 */ 136192, 26624, 30720, 40960, 45056, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192,
/*  7036 */ 136192, 136192, 136192, 136192, 136192, 136192, 0, 0, 0, 0, 0, 0, 0, 39936, 47104, 136192, 136192, 47104,
/*  7054 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 44032, 0, 0, 44032,
/*  7069 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 133, 133, 46469, 136192, 136192, 136192, 136192, 136192, 136192,
/*  7092 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 0, 32768, 0, 518, 136192, 136192,
/*  7108 */ 48646, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 50176,
/*  7122 */ 50176, 0, 50176, 0, 50176, 50176, 50176, 50176, 50176, 50176, 50176, 0, 0, 0, 0, 0, 0, 364, 364, 364, 364,
/*  7143 */ 0, 0, 6647, 0, 0, 131, 0, 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9216, 9216, 9216, 0, 51200, 0, 0, 0, 0,
/*  7172 */ 0, 0, 0, 0, 0, 0, 0, 51200, 51200, 0, 0, 0, 0, 51200, 0, 0, 51200, 0, 51200, 51200, 0, 51200, 51200, 0,
/*  7196 */ 51200, 0, 0, 51200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 51200, 51200, 51200, 51200, 51200, 51200, 51200, 0, 51200,
/*  7218 */ 51200, 51200, 0, 51200, 0, 136192, 0, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192,
/*  7233 */ 136192, 136192, 136192, 136192, 0, 0, 0, 0, 0, 600, 6647, 131, 131, 131, 131, 131, 131, 131, 131, 131, 0,
/*  7254 */ 731, 131, 131, 131, 131, 131, 668, 668, 0, 671, 671, 0, 0, 600, 600, 6647, 131, 131, 131, 131, 131, 131,
/*  7276 */ 430, 131, 131, 131, 131, 131, 131, 131, 131, 131, 514, 131, 131, 131, 0, 0, 0, 0, 0, 0, 196, 357, 0, 363, 0,
/*  7301 */ 131, 131, 131, 131, 131, 131, 131, 131, 513, 131, 131, 131, 131, 0, 0, 0, 357, 754, 131, 131, 131, 131, 131,
/*  7324 */ 131, 131, 0, 131, 131, 131, 131, 131, 131, 131, 98944, 131, 131, 131, 131, 357, 0, 131, 131, 131, 131, 131,
/*  7346 */ 131, 0, 131, 131, 131, 131, 131, 131, 0, 0, 432, 131, 131, 131, 131, 131, 131, 620, 131, 131, 196, 131, 0,
/*  7369 */ 131, 131, 0, 196, 131, 0, 196, 131, 752, 0, 0, 0, 0, 0, 0, 0, 0, 386, 0, 136192, 0, 136192, 0, 0, 0, 0, 0,
/*  7396 */ 0, 196, 357, 0, 7168, 7168, 131, 131, 131, 131, 131, 131, 131, 131, 545, 131, 131, 131, 131, 131, 131, 131,
/*  7418 */ 0, 0, 0, 0, 7168, 600, 6647, 131, 131, 131, 131, 131, 131, 131, 131, 131, 344, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/*  7444 */ 196, 357, 0, 364, 364, 131, 131, 131, 131, 131, 131, 131, 131, 640, 131, 131, 0, 0, 0, 0, 131, 0, 0, 0, 196,
/*  7469 */ 357, 0, 6144, 6144, 131, 131, 131, 131, 131, 131, 131, 131, 696, 131, 131, 131, 131, 131, 131, 131, 0, 0,
/*  7491 */ 6144, 0, 0, 0, 6144, 131, 131, 131, 131, 131, 131, 131, 131, 131, 410, 131, 131, 131, 131, 131, 131, 131,
/*  7513 */ 131, 131, 422, 0, 0, 0, 196, 357, 0, 365, 0, 131, 131, 131, 131, 131, 131, 131, 131, 739, 131, 131, 131, 0,
/*  7537 */ 131, 66560, 0, 0, 0, 52224, 52224, 0, 0, 52224, 52224, 0, 0, 0, 0, 0, 0, 52224, 52224, 0, 0, 0, 0, 52224, 0,
/*  7562 */ 0, 52224, 0, 0, 52224, 0, 0, 52224, 0, 0, 52224, 0, 0, 0, 52224, 0, 0, 0, 52224, 52224, 0, 0, 0, 0, 52224,
/*  7587 */ 0, 0, 52224, 52224, 0, 52224, 0, 52224, 52224, 0, 52224, 52224, 52224, 52224, 0, 0, 0, 0, 0, 0, 497, 0, 366,
/*  7610 */ 498, 0, 0, 0, 366, 367, 131, 0, 0, 0, 356, 358, 0, 0, 0, 136192, 136192, 136192, 136192, 136192, 136192,
/*  7631 */ 136192, 136192, 0, 0, 0, 196, 0, 495, 0, 0, 0, 0, 0, 0, 0, 0, 0, 136192, 265, 136192, 136192, 136192,
/*  7653 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 25600, 0, 0, 0, 0, 0, 0, 0, 0,
/*  7671 */ 136192, 0, 495, 136192, 136192, 136192, 136192, 136192, 136192, 0, 136192, 136192, 136192, 136192, 136192,
/*  7686 */ 136192, 0, 0, 0, 18432, 0, 0, 0, 0, 0, 136192, 356, 136192, 0, 136192, 136192, 0, 356, 136192, 0, 356,
/*  7707 */ 136192, 356, 0, 0, 0, 0, 0, 0, 0, 0, 590, 0, 0, 594, 0, 0, 0, 597, 0, 0, 0, 53248, 0, 0, 0, 0, 0, 0, 0, 0,
/*  7737 */ 53248, 0, 0, 53248, 53248, 0, 0, 0, 0, 0, 53248, 53248, 53248, 53248, 53248, 0, 0, 0, 0, 0, 0, 588, 0, 0, 0,
/*  7762 */ 0, 594, 0, 0, 0, 597, 0, 0, 0, 196, 357, 0, 366, 367, 131, 131, 131, 131, 131, 131, 131, 131, 417, 131, 131,
/*  7787 */ 131, 131, 420, 131, 131, 423, 497, 498, 598, 0, 599, 0, 602, 131, 131, 131, 131, 131, 131, 131, 131, 131,
/*  7809 */ 434, 131, 131, 131, 439, 131, 131, 0, 0, 0, 0, 0, 598, 599, 672, 0, 602, 131, 131, 131, 131, 131, 131, 477,
/*  7833 */ 0, 0, 0, 0, 482, 0, 0, 0, 0, 133, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13312, 205, 133, 133, 133,
/*  7863 */ 133, 205, 0, 133, 133, 133, 205, 133, 133, 133, 133, 133, 133, 186, 186, 186, 186, 186, 133, 205, 205, 205,
/*  7885 */ 133, 253, 0, 131, 0, 131, 131, 272, 131, 131, 281, 131, 131, 131, 290, 293, 131, 0, 131, 0, 131, 269, 275,
/*  7908 */ 277, 131, 284, 285, 131, 289, 131, 131, 131, 0, 131, 131, 0, 464, 0, 0, 0, 80896, 0, 0, 131, 471, 0, 0, 0,
/*  7933 */ 281, 322, 131, 324, 290, 272, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 37888, 0, 0, 37888, 37888, 131, 272, 131,
/*  7958 */ 281, 131, 131, 131, 131, 281, 0, 0, 0, 347, 0, 0, 0, 0, 0, 0, 715, 716, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/*  7987 */ 593, 494, 357, 0, 596, 0, 0, 355, 196, 357, 0, 0, 0, 368, 290, 131, 131, 131, 272, 131, 131, 131, 682, 131,
/*  8011 */ 684, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 410, 0, 0, 0, 0, 559, 374, 293, 131, 131, 131, 131,
/*  8034 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 368, 0, 131, 131, 272, 131, 368, 131, 131, 131, 131, 131, 131, 131, 272, 368,
/*  8059 */ 131, 0, 131, 0, 131, 271, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 563, 0, 0, 566, 0, 0, 569, 131,
/*  8083 */ 131, 0, 131, 0, 0, 0, 0, 0, 0, 422, 131, 131, 0, 0, 0, 0, 0, 0, 131, 131, 131, 0, 0, 74752, 91136, 131, 374,
/*  8110 */ 131, 131, 400, 131, 131, 403, 368, 265, 4362, 131, 131, 131, 131, 131, 131, 510, 131, 131, 131, 131, 441,
/*  8131 */ 477, 0, 0, 0, 284, 412, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 537, 131,
/*  8154 */ 444, 0, 0, 0, 0, 0, 131, 450, 131, 0, 0, 0, 0, 0, 0, 131, 131, 131, 452, 0, 0, 0, 0, 0, 472, 131, 131, 131,
/*  8182 */ 131, 131, 131, 0, 0, 0, 0, 0, 0, 485, 0, 488, 131, 440, 131, 131, 131, 131, 131, 131, 450, 131, 515, 131,
/*  8206 */ 131, 0, 0, 0, 0, 0, 0, 131, 131, 64798, 0, 0, 0, 0, 131, 131, 541, 537, 131, 131, 131, 131, 131, 131, 131,
/*  8231 */ 131, 131, 131, 131, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 0, 0, 574, 0, 0, 131, 131, 131, 131, 578, 131,
/*  8258 */ 131, 131, 0, 0, 581, 622, 131, 131, 624, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 632, 131, 0, 131,
/*  8281 */ 131, 0, 0, 0, 0, 0, 131, 0, 0, 131, 131, 0, 0, 0, 647, 0, 0, 73334, 131, 131, 0, 652, 0, 0, 131, 131, 634,
/*  8308 */ 271, 131, 131, 131, 131, 131, 131, 131, 131, 0, 0, 0, 0, 131, 131, 131, 0, 131, 131, 0, 0, 0, 0, 332, 0, 0,
/*  8334 */ 668, 668, 0, 671, 671, 0, 0, 600, 600, 6647, 131, 131, 675, 131, 131, 131, 0, 0, 0, 0, 658, 0, 0, 0, 0, 0,
/*  8360 */ 0, 0, 0, 0, 0, 0, 500, 0, 0, 0, 136192, 691, 637, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131,
/*  8384 */ 131, 131, 131, 410, 131, 723, 131, 131, 131, 131, 131, 131, 131, 131, 0, 131, 131, 131, 131, 131, 131, 688,
/*  8406 */ 131, 131, 131, 131, 131, 134, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21504, 177, 134, 134, 177, 0,
/*  8433 */ 243, 134, 134, 0, 0, 0, 0, 0, 243, 243, 243, 0, 131, 0, 267, 131, 131, 131, 131, 131, 131, 131, 131, 131,
/*  8457 */ 131, 131, 547, 131, 131, 131, 131, 0, 0, 0, 196, 357, 0, 363, 0, 131, 131, 131, 131, 371, 131, 131, 131, 0,
/*  8481 */ 0, 0, 657, 0, 0, 0, 0, 0, 0, 0, 0, 666, 0, 267, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 371, 131,
/*  8507 */ 131, 131, 0, 0, 565, 0, 0, 0, 131, 131, 131, 0, 131, 0, 0, 0, 0, 196, 131, 131, 131, 0, 131, 131, 131, 131,
/*  8533 */ 0, 0, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 305, 0, 0, 0, 0, 131, 0, 0, 0, 196, 0, 357, 0, 0, 0,
/*  8560 */ 0, 0, 0, 6647, 0, 0, 131, 0, 131, 0, 0, 0, 0, 0, 0, 0, 0, 196, 196, 753, 0, 573, 0, 0, 0, 131, 131, 131,
/*  8588 */ 577, 131, 131, 131, 131, 0, 0, 0, 0, 0, 0, 286, 131, 131, 0, 0, 0, 0, 357, 131, 131, 131, 131, 131, 131, 0,
/*  8614 */ 131, 131, 131, 131, 131, 131, 0, 0, 613, 131, 131, 131, 131, 131, 131, 131, 621, 131, 135, 0, 0, 0, 0, 0, 0,
/*  8639 */ 0, 0, 0, 0, 0, 0, 149, 0, 0, 0, 0, 0, 0, 42204, 0, 0, 0, 0, 0, 0, 0, 0, 42204, 42204, 0, 42204, 0, 42204,
/*  8667 */ 42204, 42204, 42204, 42204, 42204, 42204, 0, 0, 0, 0, 0, 0, 265, 0, 0, 0, 136192, 0, 136192, 0, 0, 0, 0,
/*  8690 */ 196, 136192, 136192, 136192, 0, 136192, 136192, 136192, 136192, 0, 0, 0, 0, 0, 0, 136192, 136192, 136192, 0,
/*  8709 */ 0, 0, 0, 136192, 263, 0, 131, 0, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 630, 131, 131,
/*  8732 */ 131, 131, 459, 131, 0, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 131, 131, 131, 131, 131, 604, 131, 131, 131, 0, 0,
/*  8758 */ 491, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6647, 0, 0, 131, 0, 131, 0, 0, 0, 0, 0, 0, 0, 0, 196, 752, 0, 131, 609, 131,
/*  8788 */ 131, 0, 0, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 419, 131, 131, 131, 131, 131, 131, 131, 623,
/*  8810 */ 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 421, 131, 668, 668, 0, 671, 671, 0, 0,
/*  8833 */ 600, 600, 6647, 131, 131, 131, 131, 131, 678, 131, 0, 131, 92446, 0, 0, 0, 0, 0, 131, 0, 0, 131, 131, 0, 0,
/*  8858 */ 62464, 0, 0, 0, 131, 131, 131, 0, 0, 0, 0, 131, 131, 131, 0, 131, 131, 328, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/*  8886 */ 719, 718, 0, 722, 721, 600, 0, 712, 89088, 92160, 0, 0, 0, 0, 0, 0, 718, 718, 0, 721, 721, 600, 131, 131,
/*  8910 */ 537, 131, 131, 131, 737, 131, 131, 131, 131, 131, 0, 131, 0, 0, 0, 0, 196, 131, 131, 131, 0, 131, 131, 131,
/*  8934 */ 131, 77824, 0, 357, 754, 755, 131, 131, 131, 131, 131, 131, 761, 131, 763, 131, 131, 131, 131, 265, 131,
/*  8955 */ 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 286, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131,
/*  8976 */ 410, 131, 131, 131, 131, 768, 769, 0, 0, 0, 0, 0, 0, 0, 196, 0, 0, 0, 0, 136192, 136192, 136192, 136192,
/*  8999 */ 136192, 136192, 136192, 136192, 0, 136192, 0, 0, 0, 0, 0, 0, 0, 774, 136, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/*  9025 */ 0, 0, 0, 0, 24791, 0, 0, 0, 0, 0, 158, 0, 0, 0, 0, 0, 0, 0, 0, 136, 136, 136, 0, 0, 0, 136, 0, 172, 179,
/*  9054 */ 179, 179, 179, 179, 179, 179, 179, 0, 0, 0, 0, 0, 179, 179, 179, 179, 179, 179, 0, 179, 179, 179, 179, 179,
/*  9078 */ 179, 179, 179, 136, 179, 136, 136, 179, 0, 245, 136, 136, 0, 0, 0, 0, 0, 245, 261, 261, 0, 131, 0, 131, 131,
/*  9103 */ 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 435, 131, 131, 131, 131, 131, 131, 0, 88064, 0, 0, 196,
/*  9125 */ 88350, 131, 131, 0, 131, 131, 131, 131, 0, 0, 131, 131, 131, 131, 131, 618, 131, 131, 131, 131, 196, 131, 0,
/*  9148 */ 131, 131, 0, 196, 131, 96256, 196, 96542, 196, 0, 0, 0, 0, 0, 0, 0, 0, 2048, 2048, 2048, 0, 0, 0, 0, 0, 0,
/*  9174 */ 0, 0, 0, 0, 44032, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 162, 0, 162, 0, 137, 137, 137, 0, 0, 0, 137, 0, 0, 137,
/*  9204 */ 137, 0, 0, 0, 162, 0, 0, 0, 162, 0, 162, 137, 137, 0, 0, 0, 0, 0, 0, 44253, 0, 0, 0, 0, 0, 0, 0, 0, 44265,
/*  9233 */ 44265, 0, 44273, 0, 44273, 44273, 44273, 44273, 44273, 44273, 44273, 0, 0, 0, 0, 0, 0, 364, 131, 131, 131,
/*  9254 */ 131, 131, 131, 131, 131, 131, 433, 131, 131, 131, 131, 440, 131, 207, 137, 137, 137, 137, 207, 0, 137, 137,
/*  9276 */ 137, 207, 137, 137, 137, 137, 137, 137, 187, 187, 187, 187, 187, 137, 207, 207, 207, 137, 137, 137, 137,
/*  9297 */ 207, 0, 137, 137, 137, 0, 0, 0, 0, 0, 207, 207, 262, 0, 131, 0, 131, 131, 131, 276, 131, 131, 131, 131, 131,
/*  9322 */ 291, 131, 296, 0, 0, 0, 196, 357, 0, 364, 364, 131, 325, 131, 131, 131, 131, 131, 131, 553, 131, 131, 131,
/*  9345 */ 131, 0, 0, 0, 0, 0, 0, 131, 131, 131, 0, 0, 0, 0, 131, 291, 131, 131, 131, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0,
/*  9374 */ 0, 131, 131, 131, 0, 325, 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 52224, 0, 0, 0, 0, 0, 131, 131, 131, 276,
/*  9402 */ 131, 131, 394, 131, 131, 131, 131, 131, 131, 131, 131, 554, 131, 131, 131, 0, 0, 0, 0, 0, 0, 131, 131, 131,
/*  9426 */ 0, 131, 0, 0, 325, 131, 131, 131, 401, 131, 131, 131, 265, 4362, 131, 131, 131, 409, 131, 131, 131, 725,
/*  9448 */ 89374, 131, 131, 131, 131, 0, 131, 131, 131, 131, 131, 131, 131, 314, 131, 131, 131, 131, 131, 131, 131,
/*  9469 */ 512, 131, 131, 131, 131, 131, 0, 0, 0, 0, 0, 0, 131, 131, 131, 0, 0, 317, 0, 0, 131, 131, 0, 131, 522, 131,
/*  9495 */ 131, 131, 131, 131, 131, 131, 131, 131, 555, 131, 0, 0, 0, 0, 0, 540, 131, 131, 131, 131, 131, 544, 131,
/*  9518 */ 131, 131, 131, 131, 131, 131, 131, 131, 627, 131, 131, 131, 131, 131, 131, 560, 131, 562, 0, 0, 0, 0, 567,
/*  9541 */ 0, 131, 131, 131, 61440, 131, 0, 60416, 0, 0, 0, 0, 0, 600, 6647, 131, 131, 8478, 131, 131, 131, 131, 131,
/*  9564 */ 131, 638, 131, 131, 131, 131, 0, 0, 0, 0, 131, 131, 69918, 131, 131, 131, 626, 131, 131, 131, 131, 131, 131,
/*  9587 */ 131, 631, 131, 131, 131, 81319, 131, 131, 131, 0, 0, 0, 481, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 136192, 0,
/*  9612 */ 136192, 25600, 0, 0, 668, 668, 0, 671, 671, 0, 0, 600, 600, 6647, 131, 131, 131, 676, 131, 131, 276, 131,
/*  9634 */ 131, 131, 131, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 321, 131, 84254, 131, 131, 131, 131, 131, 131, 131, 0,
/*  9659 */ 131, 131, 131, 131, 131, 131, 131, 395, 131, 131, 131, 131, 131, 131, 131, 639, 131, 131, 131, 0, 0, 0, 0,
/*  9682 */ 131, 0, 745, 86302, 0, 131, 0, 87040, 0, 0, 0, 750, 0, 86016, 196, 196, 0, 0, 0, 0, 0, 135, 135, 135, 135,
/*  9707 */ 135, 135, 135, 0, 0, 0, 0, 0, 0, 0, 0, 167, 0, 135, 135, 0, 0, 357, 357, 131, 87326, 131, 131, 131, 759,
/*  9732 */ 131, 0, 762, 131, 131, 131, 131, 131, 429, 131, 131, 432, 131, 131, 131, 131, 131, 131, 131, 543, 131, 131,
/*  9754 */ 131, 131, 131, 131, 548, 131, 131, 131, 766, 131, 441, 131, 131, 131, 0, 131, 0, 0, 771, 0, 0, 0, 103424,
/*  9777 */ 196, 131, 0, 131, 131, 0, 196, 131, 0, 196, 131, 196, 0, 0, 0, 0, 0, 0, 0, 0, 0, 591, 0, 0, 0, 0, 0, 0, 0,
/*  9806 */ 0, 0, 0, 718, 718, 0, 721, 721, 600, 0, 0, 131, 775, 131, 131, 131, 103710, 778, 131, 780, 65822, 131, 131,
/*  9829 */ 131, 81920, 82206, 0, 0, 0, 0, 196, 131, 131, 131, 0, 131, 131, 131, 131, 0, 0, 131, 131, 131, 131, 537,
/*  9852 */ 131, 131, 131, 131, 131, 196, 131, 0, 131, 131, 793, 196, 795, 0, 196, 131, 196, 0, 0, 0, 0, 0, 0, 0, 0,
/*  9877 */ 6144, 0, 0, 0, 0, 0, 0, 131, 60702, 131, 131, 131, 131, 131, 131, 0, 0, 0, 0, 0, 0, 287, 131, 131, 0, 0, 0,
/*  9904 */ 138, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28888, 264, 0, 131, 0, 131, 131, 131, 131, 131, 131, 131,
/*  9932 */ 286, 131, 131, 131, 131, 131, 556, 0, 0, 97280, 0, 0, 0, 0, 196, 357, 0, 7168, 7168, 131, 131, 131, 131,
/*  9955 */ 131, 131, 131, 286, 131, 131, 131, 131, 131, 131, 131, 0, 131, 0, 73728, 0, 131, 131, 131, 131, 131, 77086,
/*  9977 */ 131, 131, 131, 131, 286, 131, 131, 131, 77086, 0, 0, 0, 196, 0, 357, 7168, 7168, 7168, 7168, 0, 0, 6647, 0,
/* 10000 */ 0, 131, 0, 131, 0, 0, 0, 0, 0, 0, 751, 0, 0, 0, 0, 0, 0, 0, 0, 36864, 36864, 36864, 0, 0, 0, 0, 0, 0, 0, 0,
/* 10030 */ 0, 0, 136192, 0, 136192, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6647, 0, 0, 131, 529, 131, 131, 131, 265, 131,
/* 10057 */ 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 697, 286, 131, 131, 131, 131, 131, 701, 702, 131, 0, 0, 0,
/* 10080 */ 0, 0, 131, 0, 0, 131, 131, 0, 0, 0, 0, 196, 131, 131, 131, 0, 131, 131, 286, 131, 0, 0, 0, 0, 196, 131, 131,
/* 10107 */ 131, 787, 131, 789, 131, 131, 0, 0, 0, 0, 785, 131, 131, 131, 0, 131, 131, 131, 131, 0, 0, 308, 0, 0, 0,
/* 10132 */ 131, 131, 131, 315, 0, 0, 357, 357, 131, 131, 131, 757, 131, 131, 131, 0, 131, 131, 131, 131, 131, 131, 694,
/* 10155 */ 131, 131, 131, 131, 131, 131, 131, 131, 131, 727, 131, 131, 0, 131, 131, 131, 131, 131, 131, 196, 131,
/* 10176 */ 79872, 131, 80158, 0, 196, 131, 0, 196, 131, 196, 0, 0, 0, 0, 0, 0, 0, 0, 7528, 7528, 0, 0, 502, 0, 0,
/* 10201 */ 136192, 139, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 139, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/* 10231 */ 35840, 139, 139, 139, 139, 139, 139, 0, 139, 139, 139, 139, 139, 139, 139, 139, 139, 0, 139, 139, 139, 0, 0,
/* 10254 */ 0, 0, 0, 139, 139, 139, 0, 0, 0, 139, 0, 0, 139, 139, 139, 0, 131, 0, 131, 131, 131, 131, 131, 131, 131,
/* 10279 */ 131, 131, 131, 131, 131, 741, 131, 0, 131, 0, 0, 0, 0, 0, 82944, 0, 131, 131, 131, 131, 131, 83230, 131,
/* 10302 */ 131, 0, 0, 0, 0, 0, 0, 131, 650, 131, 0, 0, 0, 0, 131, 297, 302, 131, 305, 0, 0, 0, 0, 310, 311, 131, 297,
/* 10329 */ 297, 0, 316, 0, 0, 0, 0, 0, 136, 136, 136, 136, 136, 136, 136, 0, 0, 0, 0, 158, 0, 0, 0, 158, 0, 136, 136,
/* 10356 */ 0, 0, 0, 0, 0, 196, 357, 0, 0, 0, 131, 131, 342, 323, 131, 337, 131, 131, 131, 131, 342, 131, 131, 0, 0, 0,
/* 10382 */ 0, 0, 0, 0, 0, 0, 0, 131, 131, 0, 0, 131, 131, 342, 302, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 131, 323,
/* 10411 */ 0, 131, 273, 0, 329, 0, 0, 0, 0, 334, 0, 131, 131, 337, 131, 131, 131, 131, 342, 396, 398, 131, 131, 337,
/* 10435 */ 131, 131, 284, 131, 131, 131, 131, 131, 131, 131, 131, 0, 557, 558, 0, 0, 0, 0, 0, 0, 50176, 0, 0, 0, 0, 0,
/* 10461 */ 0, 0, 0, 50176, 0, 50176, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 109568, 0, 0, 131, 342, 396, 337, 131, 131,
/* 10489 */ 337, 131, 265, 4362, 131, 131, 131, 131, 131, 131, 637, 131, 131, 131, 131, 131, 0, 642, 94208, 0, 643, 679,
/* 10511 */ 131, 131, 0, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 62750, 131, 0, 131, 131, 0, 0, 0, 0, 0, 131,
/* 10535 */ 0, 68608, 131, 68894, 0, 83968, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 0, 0, 0, 0, 0, 137, 137,
/* 10563 */ 137, 137, 137, 137, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27648, 0, 0, 0, 163, 0, 140, 140, 140,
/* 10592 */ 0, 0, 0, 140, 0, 174, 181, 181, 181, 181, 181, 181, 150, 150, 150, 194, 194, 181, 208, 208, 208, 181, 181,
/* 10615 */ 181, 181, 208, 222, 181, 181, 181, 208, 181, 181, 181, 181, 235, 235, 208, 222, 247, 252, 252, 222, 222,
/* 10636 */ 222, 222, 222, 256, 256, 256, 256, 0, 131, 0, 131, 131, 131, 131, 131, 282, 131, 131, 131, 131, 131, 131,
/* 10658 */ 736, 131, 131, 131, 131, 131, 742, 0, 131, 0, 0, 318, 0, 0, 321, 131, 131, 0, 131, 131, 0, 0, 0, 0, 0, 0, 0,
/* 10685 */ 0, 0, 0, 131, 0, 322, 0, 0, 0, 0, 0, 0, 196, 357, 0, 0, 0, 282, 131, 131, 131, 131, 131, 131, 131, 728, 729,
/* 10712 */ 0, 131, 131, 131, 131, 131, 131, 0, 131, 131, 131, 131, 282, 131, 131, 131, 131, 131, 131, 131, 131, 321,
/* 10734 */ 131, 0, 131, 131, 0, 0, 0, 0, 0, 131, 708, 0, 709, 131, 710, 0, 0, 0, 0, 0, 135, 135, 135, 0, 0, 149, 169,
/* 10761 */ 0, 171, 178, 178, 178, 178, 178, 178, 149, 149, 149, 149, 149, 178, 206, 206, 206, 178, 178, 178, 178, 206,
/* 10783 */ 0, 178, 178, 178, 206, 178, 178, 178, 178, 135, 135, 206, 0, 244, 135, 135, 0, 0, 0, 0, 0, 254, 260, 260,
/* 10807 */ 443, 0, 0, 0, 0, 447, 448, 131, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 662, 0, 0, 0, 0, 131, 131, 460, 0, 131,
/* 10835 */ 131, 0, 0, 0, 0, 0, 0, 0, 0, 131, 131, 131, 131, 70942, 131, 131, 131, 131, 131, 551, 131, 131, 131, 131,
/* 10859 */ 131, 131, 131, 131, 131, 0, 0, 0, 0, 0, 0, 486, 0, 0, 582, 0, 0, 0, 0, 587, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/* 10890 */ 0, 53248, 0, 0, 0, 608, 131, 131, 131, 0, 0, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 730, 131,
/* 10913 */ 732, 131, 733, 90398, 131, 644, 131, 0, 0, 0, 0, 0, 0, 131, 131, 131, 0, 0, 0, 0, 131, 295, 131, 0, 292,
/* 10938 */ 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 160, 0, 0, 0, 135, 135, 700, 0, 131, 131, 0, 0, 0, 0, 0, 131, 0, 0, 131,
/* 10968 */ 131, 0, 0, 784, 0, 196, 131, 786, 131, 0, 131, 131, 131, 131, 0, 0, 131, 131, 615, 131, 131, 131, 131, 131,
/* 10992 */ 131, 61726, 0, 0, 131, 131, 131, 131, 131, 131, 0, 131, 131, 131, 131, 131, 782, 0, 0, 0, 0, 0, 138, 138,
/* 11016 */ 138, 0, 0, 0, 138, 0, 173, 180, 180, 180, 180, 185, 185, 188, 188, 188, 188, 188, 201, 185, 185, 185, 201,
/* 11039 */ 201, 201, 201, 185, 0, 201, 201, 201, 185, 201, 201, 224, 201, 138, 138, 185, 0, 246, 138, 138, 0, 0, 0, 0,
/* 11063 */ 0, 255, 255, 255, 141, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 51200, 0, 0, 0, 0, 0, 141, 141, 141,
/* 11092 */ 141, 141, 141, 141, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 141, 141, 0, 0, 0, 0, 0, 0, 0, 141, 141, 141, 0, 0, 0,
/* 11121 */ 141, 0, 175, 182, 182, 0, 131, 0, 131, 131, 274, 131, 278, 283, 131, 131, 131, 131, 131, 131, 265, 131, 131,
/* 11144 */ 131, 131, 131, 131, 131, 131, 131, 443, 131, 182, 141, 141, 182, 0, 182, 141, 141, 0, 0, 0, 0, 0, 182, 182,
/* 11168 */ 182, 182, 182, 182, 0, 0, 0, 0, 0, 182, 182, 182, 182, 182, 182, 0, 182, 182, 182, 182, 182, 182, 182, 182,
/* 11192 */ 141, 0, 0, 0, 283, 131, 131, 0, 131, 326, 0, 0, 0, 331, 0, 0, 0, 0, 0, 0, 4362, 0, 0, 0, 136192, 0, 136192,
/* 11219 */ 0, 0, 0, 0, 10436, 136192, 136192, 136192, 0, 136192, 136192, 136192, 136192, 0, 0, 131, 274, 131, 339, 131,
/* 11239 */ 131, 131, 131, 339, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 0, 375, 0, 0, 0, 0, 0, 0, 196, 357, 0, 6144, 6144,
/* 11267 */ 339, 131, 131, 131, 131, 326, 278, 131, 0, 131, 131, 0, 0, 0, 0, 0, 707, 0, 0, 131, 131, 0, 0, 0, 446, 0, 0,
/* 11294 */ 131, 131, 451, 0, 0, 0, 0, 0, 457, 0, 131, 131, 274, 131, 339, 131, 131, 131, 131, 131, 131, 131, 326, 339,
/* 11318 */ 131, 0, 131, 131, 0, 0, 0, 0, 706, 131, 0, 0, 131, 131, 0, 0, 0, 0, 0, 0, 54272, 0, 0, 0, 0, 0, 0, 0, 0,
/* 11347 */ 234, 234, 0, 54506, 0, 54506, 54506, 54506, 54506, 54506, 54506, 54506, 0, 0, 0, 0, 0, 0, 601, 136192,
/* 11367 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 489, 0, 0, 0, 0, 0, 0, 0, 6144, 0, 0, 0, 0,
/* 11388 */ 0, 0, 504, 505, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 516, 516, 0, 0, 0, 0, 0, 0, 7168, 7168,
/* 11412 */ 7168, 7168, 0, 0, 6647, 0, 0, 131, 0, 131, 0, 0, 0, 0, 0, 0, 0, 0, 196, 196, 0, 0, 0, 0, 0, 0, 576, 131,
/* 11440 */ 131, 131, 131, 131, 131, 131, 0, 0, 0, 0, 0, 0, 131, 570, 131, 0, 131, 0, 0, 0, 0, 0, 585, 0, 0, 0, 0, 0, 0,
/* 11469 */ 0, 0, 0, 0, 0, 0, 163, 0, 140, 140, 0, 0, 6144, 0, 0, 0, 6144, 131, 11550, 131, 131, 131, 131, 131, 131,
/* 11494 */ 607, 654, 131, 131, 0, 72704, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20480, 20480, 20480, 0, 734, 735, 131,
/* 11519 */ 131, 131, 131, 131, 131, 131, 131, 131, 131, 0, 131, 0, 0, 0, 0, 0, 0, 0, 196, 0, 0, 131, 131, 131, 131,
/* 11544 */ 131, 131, 760, 0, 131, 131, 131, 131, 131, 131, 265, 131, 131, 534, 131, 131, 131, 131, 131, 131, 131, 131,
/* 11566 */ 265, 131, 131, 131, 535, 131, 131, 131, 131, 539, 131, 131, 0, 0, 320, 131, 131, 131, 0, 131, 131, 0, 0, 0,
/* 11590 */ 0, 0, 0, 0, 0, 0, 0, 131, 0, 376, 0, 0, 0, 0, 354, 0, 196, 357, 0, 0, 0, 131, 131, 131, 131, 131, 131, 131,
/* 11618 */ 287, 142, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 151, 142, 142, 168, 0, 0, 151, 168, 0, 0, 142, 142, 0,
/* 11647 */ 0, 0, 0, 0, 142, 142, 142, 142, 142, 142, 142, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 142, 142, 0, 0, 142, 142, 142,
/* 11675 */ 142, 142, 142, 189, 189, 189, 189, 189, 202, 209, 209, 209, 202, 202, 202, 202, 209, 0, 202, 202, 202, 209,
/* 11697 */ 202, 202, 202, 202, 142, 142, 209, 0, 202, 142, 142, 0, 0, 0, 0, 0, 257, 257, 257, 257, 0, 131, 0, 131, 131,
/* 11722 */ 131, 131, 279, 131, 131, 288, 131, 131, 131, 131, 265, 131, 432, 131, 131, 286, 131, 131, 131, 131, 131,
/* 11743 */ 131, 131, 131, 131, 131, 131, 131, 131, 131, 550, 131, 0, 307, 0, 196, 357, 0, 0, 0, 131, 131, 131, 131,
/* 11766 */ 131, 131, 372, 373, 0, 131, 131, 131, 131, 131, 340, 131, 131, 131, 131, 388, 131, 131, 131, 373, 131, 131,
/* 11788 */ 413, 131, 131, 131, 131, 131, 131, 418, 131, 131, 131, 131, 131, 131, 306, 0, 0, 0, 0, 0, 131, 131, 131, 0,
/* 11812 */ 0, 0, 131, 0, 0, 131, 131, 424, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 437, 131, 131, 131,
/* 11835 */ 0, 131, 131, 0, 0, 0, 466, 0, 0, 0, 0, 131, 131, 131, 0, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 131, 131, 458,
/* 11863 */ 131, 131, 0, 131, 131, 0, 0, 0, 0, 0, 0, 468, 0, 131, 131, 131, 131, 131, 287, 131, 131, 131, 131, 287, 131,
/* 11888 */ 131, 131, 287, 0, 0, 131, 131, 0, 131, 131, 523, 131, 131, 131, 131, 131, 131, 131, 131, 340, 131, 131, 131,
/* 11911 */ 131, 0, 345, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 136192, 0, 136192, 0, 29696, 0, 131, 131, 610, 131, 0, 0, 131,
/* 11937 */ 131, 131, 131, 131, 131, 131, 131, 131, 131, 415, 131, 416, 131, 131, 131, 131, 131, 131, 131, 131, 131,
/* 11958 */ 427, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 629, 131, 131, 131, 131, 131, 131, 692, 131,
/* 11979 */ 131, 131, 131, 695, 131, 131, 131, 131, 286, 131, 131, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/* 12006 */ 0, 0, 131, 131, 0, 0, 131, 58368, 58654, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21504, 0, 0, 0, 0, 0, 131, 131,
/* 12035 */ 131, 131, 131, 131, 131, 0, 131, 131, 131, 131, 131, 765, 0, 357, 131, 131, 131, 776, 777, 131, 0, 779, 131,
/* 12058 */ 131, 131, 131, 131, 0, 131, 131, 131, 0, 0, 0, 0, 0, 131, 131, 131, 131, 131, 131, 131, 131, 0, 0, 0, 0, 0,
/* 12084 */ 131, 131, 131, 131, 131, 131, 131, 0, 0, 0, 0, 0, 0, 0, 383, 0, 131, 335, 275, 338, 284, 131, 341, 131, 343,
/* 12109 */ 284, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 131, 131, 131, 131, 131, 131, 131, 131, 353, 0, 0, 196, 357, 0, 0,
/* 12136 */ 0, 284, 131, 131, 131, 131, 275, 131, 131, 300, 131, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 131, 0, 131,
/* 12162 */ 131, 131, 131, 131, 131, 131, 101662, 131, 101662, 131, 0, 131, 335, 392, 67922, 393, 131, 131, 131, 131,
/* 12182 */ 131, 131, 131, 392, 393, 131, 0, 131, 131, 0, 0, 0, 705, 0, 131, 0, 0, 131, 131, 0, 0, 0, 0, 196, 131, 131,
/* 12208 */ 131, 0, 131, 131, 131, 739, 0, 790, 131, 131, 474, 131, 131, 476, 131, 0, 0, 0, 0, 483, 0, 0, 0, 0, 0, 0, 0,
/* 12235 */ 0, 37888, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6344, 0, 0, 0, 6344, 0, 0, 131, 131, 131, 131, 758, 131, 131, 0,
/* 12263 */ 131, 131, 131, 131, 131, 131, 475, 131, 131, 0, 0, 480, 0, 0, 0, 0, 487, 0, 0, 0, 131, 131, 131, 131, 131,
/* 12288 */ 131, 0, 131, 131, 131, 131, 781, 131, 0, 131, 0, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131,
/* 12311 */ 0, 131, 0, 0, 0, 0, 0, 0, 0, 143, 143, 143, 143, 143, 143, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/* 12342 */ 110592, 165, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 143, 143, 0, 0, 0, 0, 0, 0, 106719, 0, 0, 0, 0, 0, 0, 0, 0,
/* 12372 */ 236, 236, 106496, 106732, 0, 106732, 106732, 106732, 106732, 106732, 106732, 106732, 0, 0, 0, 0, 0, 0,
/* 12390 */ 35840, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 197, 0, 0, 0, 197, 0, 0, 0, 0, 0, 143, 143, 143, 0, 0, 0, 143, 0, 0,
/* 12421 */ 143, 143, 143, 237, 0, 143, 143, 143, 0, 0, 0, 0, 0, 210, 210, 210, 210, 143, 143, 143, 143, 210, 0, 143,
/* 12445 */ 143, 143, 210, 143, 143, 143, 143, 143, 143, 190, 190, 190, 190, 195, 143, 210, 210, 210, 143, 210, 0, 131,
/* 12467 */ 0, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 542, 131, 131, 131, 131, 286, 131, 131, 131,
/* 12489 */ 549, 131, 131, 0, 490, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 0, 131, 0, 0, 0, 0, 0, 519, 131, 0, 131,
/* 12519 */ 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 552, 131, 131, 131, 131, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0,
/* 12544 */ 0, 339, 0, 0, 131, 131, 93470, 131, 131, 131, 0, 131, 131, 131, 131, 131, 131, 0, 307, 0, 0, 0, 0, 312, 131,
/* 12569 */ 131, 0, 0, 0, 0, 0, 649, 131, 131, 131, 651, 0, 0, 0, 653, 0, 0, 0, 0, 0, 144, 144, 144, 144, 144, 144, 144,
/* 12596 */ 0, 0, 0, 0, 0, 144, 144, 144, 144, 144, 0, 0, 0, 0, 0, 144, 144, 144, 0, 0, 0, 144, 0, 0, 144, 144, 0, 0, 0,
/* 12625 */ 0, 0, 0, 0, 0, 0, 0, 144, 144, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 136192, 144, 144, 144, 144, 144,
/* 12655 */ 144, 0, 144, 144, 144, 144, 144, 144, 144, 144, 144, 0, 248, 144, 144, 0, 0, 0, 0, 0, 248, 248, 248, 248, 0,
/* 12680 */ 131, 0, 131, 270, 131, 131, 131, 131, 131, 131, 131, 131, 294, 131, 0, 131, 131, 0, 99328, 0, 0, 0, 131, 0,
/* 12704 */ 0, 131, 131, 0, 0, 0, 0, 0, 133, 133, 133, 0, 0, 0, 133, 0, 0, 133, 133, 133, 205, 0, 242, 133, 133, 0, 0,
/* 12731 */ 0, 0, 0, 253, 253, 253, 131, 303, 131, 131, 0, 0, 0, 0, 0, 0, 131, 131, 131, 0, 0, 0, 455, 0, 0, 270, 131,
/* 12758 */ 131, 131, 131, 131, 131, 131, 131, 0, 0, 0, 0, 348, 0, 352, 0, 0, 348, 196, 357, 0, 0, 0, 131, 131, 131,
/* 12783 */ 370, 131, 131, 131, 131, 612, 0, 131, 614, 131, 131, 617, 131, 619, 131, 131, 131, 131, 375, 131, 379, 131,
/* 12805 */ 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 0, 131, 0, 0, 0, 0, 749, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 718, 718, 720,
/* 12836 */ 721, 721, 600, 0, 131, 391, 131, 131, 131, 131, 131, 131, 397, 131, 131, 131, 131, 131, 131, 625, 131, 131,
/* 12858 */ 131, 131, 131, 131, 131, 131, 131, 131, 633, 131, 131, 399, 131, 131, 131, 131, 131, 265, 4362, 131, 131,
/* 12879 */ 131, 131, 131, 131, 636, 131, 131, 131, 131, 131, 131, 0, 0, 0, 0, 131, 294, 303, 0, 131, 131, 0, 0, 0, 0,
/* 12904 */ 0, 0, 0, 0, 0, 0, 131, 131, 131, 131, 677, 131, 131, 131, 439, 0, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 131,
/* 12931 */ 131, 131, 603, 131, 131, 131, 606, 131, 0, 0, 131, 131, 0, 131, 131, 131, 76062, 131, 131, 526, 131, 131,
/* 12953 */ 131, 131, 767, 537, 0, 131, 770, 0, 0, 0, 772, 773, 0, 196, 63488, 0, 0, 0, 575, 131, 131, 63774, 131, 131,
/* 12977 */ 131, 579, 131, 0, 0, 0, 0, 0, 0, 131, 434, 131, 0, 453, 0, 0, 0, 0, 0, 0, 0, 0, 41984, 0, 0, 0, 41984, 0, 0,
/* 13006 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 41984, 0, 0, 0, 0, 0, 0, 0, 131, 94494, 0, 0, 0, 0, 0, 0, 131, 131, 131, 0, 0, 0,
/* 13037 */ 0, 131, 0, 131, 0, 0, 0, 748, 0, 0, 0, 0, 196, 196, 0, 0, 0, 0, 0, 0, 714, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/* 13069 */ 162, 0, 0, 137, 137, 152, 0, 0, 0, 0, 145, 145, 145, 145, 145, 156, 157, 0, 0, 0, 0, 0, 0, 0, 0, 51200, 0,
/* 13096 */ 0, 0, 0, 0, 0, 0, 0, 0, 145, 157, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 145, 145, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/* 13129 */ 0, 0, 0, 0, 134, 134, 0, 152, 0, 0, 152, 145, 145, 157, 0, 0, 152, 157, 0, 176, 183, 183, 183, 183, 183,
/* 13154 */ 183, 191, 191, 191, 191, 191, 203, 211, 211, 211, 203, 203, 203, 203, 211, 0, 203, 203, 203, 211, 203, 203,
/* 13176 */ 203, 203, 145, 145, 211, 0, 249, 145, 145, 0, 0, 0, 0, 0, 258, 258, 258, 258, 0, 131, 0, 268, 131, 131, 131,
/* 13201 */ 131, 131, 131, 131, 131, 131, 131, 131, 0, 131, 131, 131, 59678, 131, 131, 131, 131, 131, 131, 131, 131,
/* 13222 */ 265, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 286, 131, 131, 0, 131, 0, 0, 0, 93184, 0, 0, 0, 196,
/* 13246 */ 0, 357, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 0, 0, 0, 196, 357, 0, 0, 0, 131, 131, 131, 131, 268, 131, 131, 131,
/* 13274 */ 0, 131, 131, 463, 0, 0, 0, 467, 0, 0, 469, 470, 131, 0, 390, 131, 131, 131, 131, 131, 131, 131, 131, 131,
/* 13298 */ 131, 390, 131, 131, 131, 0, 131, 131, 685, 131, 131, 687, 131, 131, 131, 131, 131, 131, 81345, 509, 131,
/* 13319 */ 131, 131, 131, 131, 131, 131, 0, 0, 0, 0, 0, 568, 131, 131, 131, 0, 131, 572, 0, 131, 131, 507, 131, 422,
/* 13343 */ 131, 131, 131, 131, 131, 131, 131, 131, 0, 517, 0, 0, 0, 0, 0, 138, 138, 138, 138, 138, 138, 138, 0, 0, 0,
/* 13368 */ 0, 0, 0, 0, 0, 0, 0, 164, 138, 0, 0, 0, 0, 131, 520, 0, 521, 131, 131, 131, 131, 131, 131, 131, 131, 131,
/* 13394 */ 528, 131, 530, 528, 131, 265, 131, 131, 131, 131, 131, 131, 438, 537, 131, 131, 131, 0, 131, 462, 0, 0, 465,
/* 13417 */ 0, 0, 0, 0, 0, 131, 131, 131, 131, 131, 131, 131, 131, 0, 70656, 0, 131, 680, 131, 0, 131, 131, 131, 131,
/* 13441 */ 131, 131, 131, 131, 131, 131, 131, 131, 0, 564, 0, 0, 0, 0, 131, 131, 131, 0, 131, 0, 0, 71680, 0, 131, 0,
/* 13466 */ 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 31744, 0, 0, 0, 196, 131, 0, 78110, 131, 0, 196, 131, 0, 196, 131,
/* 13494 */ 196, 0, 0, 0, 0, 0, 0, 0, 0, 105472, 105472, 0, 105472, 0, 0, 0, 0, 0, 0, 0, 364, 364, 0, 131, 131, 131,
/* 13520 */ 131, 131, 131, 131, 298, 131, 131, 131, 131, 131, 131, 131, 404, 265, 4362, 131, 131, 131, 131, 131, 131, 0,
/* 13542 */ 153, 0, 0, 0, 146, 146, 146, 146, 146, 146, 146, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 139, 139, 146,
/* 13571 */ 166, 0, 0, 0, 0, 0, 159, 159, 0, 0, 0, 146, 146, 0, 0, 0, 0, 0, 133, 133, 133, 133, 133, 133, 133, 0, 0, 0,
/* 13599 */ 0, 0, 0, 0, 0, 0, 0, 133, 133, 0, 0, 0, 0, 159, 0, 153, 146, 146, 166, 0, 0, 153, 166, 0, 0, 146, 146, 146,
/* 13627 */ 146, 146, 146, 192, 192, 192, 192, 192, 204, 212, 212, 212, 204, 204, 204, 204, 212, 0, 204, 204, 204, 212,
/* 13649 */ 204, 204, 204, 204, 146, 146, 212, 0, 250, 146, 146, 0, 0, 0, 0, 0, 259, 259, 259, 259, 0, 131, 0, 131, 131,
/* 13674 */ 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 0, 683, 131, 131, 131, 131, 131, 131, 131, 104734, 131,
/* 13695 */ 131, 131, 0, 0, 656, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 196, 0, 0, 0, 196, 298, 131, 131, 131, 0, 0, 0, 0, 0,
/* 13725 */ 0, 131, 313, 298, 0, 0, 0, 0, 0, 0, 7527, 7527, 362, 362, 0, 7669, 6647, 362, 6344, 131, 0, 0, 0, 196, 357,
/* 13750 */ 0, 0, 0, 131, 131, 298, 131, 131, 131, 131, 131, 0, 85278, 131, 0, 0, 0, 0, 0, 0, 0, 0, 131, 131, 131, 131,
/* 13776 */ 131, 131, 131, 102686, 0, 0, 0, 131, 131, 377, 131, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 0, 131, 0, 0,
/* 13803 */ 747, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6343, 0, 0, 0, 6343, 131, 377, 131, 131, 131, 131, 131, 131, 265,
/* 13829 */ 4362, 131, 131, 131, 131, 410, 411, 131, 425, 131, 131, 131, 131, 131, 431, 131, 131, 131, 131, 131, 131,
/* 13850 */ 131, 131, 282, 131, 131, 131, 131, 321, 0, 0, 346, 0, 0, 0, 0, 0, 0, 0, 0, 12288, 12288, 12288, 0, 0, 0, 0,
/* 13876 */ 0, 0, 0, 0, 0, 0, 136192, 108544, 136192, 0, 0, 0, 131, 0, 445, 0, 0, 0, 0, 449, 131, 131, 0, 0, 454, 0,
/* 13902 */ 456, 0, 0, 0, 0, 0, 139, 139, 139, 139, 139, 139, 139, 0, 0, 0, 0, 0, 139, 139, 139, 139, 139, 0, 0, 131,
/* 13928 */ 423, 0, 131, 131, 131, 131, 524, 131, 131, 131, 131, 131, 411, 131, 131, 531, 131, 265, 533, 131, 131, 131,
/* 13950 */ 131, 131, 131, 538, 131, 131, 131, 286, 432, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 438,
/* 13971 */ 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 546, 131, 131, 131, 131, 131, 549, 131, 131, 411,
/* 13992 */ 131, 131, 131, 131, 131, 131, 131, 0, 0, 0, 0, 0, 484, 0, 0, 0, 131, 561, 131, 0, 0, 0, 0, 0, 0, 131, 131,
/* 14019 */ 131, 0, 131, 0, 0, 0, 0, 0, 134, 134, 134, 0, 0, 0, 134, 0, 170, 177, 177, 177, 177, 177, 177, 0, 0, 0, 0,
/* 14046 */ 0, 177, 177, 177, 177, 177, 177, 0, 177, 177, 177, 177, 177, 177, 177, 177, 134, 0, 0, 584, 0, 586, 0, 0, 0,
/* 14071 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 35840, 0, 0, 0, 131, 75038, 91422, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 664, 0, 0, 0, 0,
/* 14102 */ 0, 134, 134, 134, 134, 134, 134, 134, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 134, 0, 0, 131, 131, 681, 0, 131,
/* 14129 */ 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 326, 131, 402, 326, 339, 265, 4362, 131, 131, 131,
/* 14150 */ 131, 131, 131, 265, 131, 131, 131, 131, 131, 536, 131, 131, 131, 131, 131, 372, 131, 131, 265, 4362, 131,
/* 14171 */ 131, 131, 131, 131, 131, 428, 131, 131, 131, 131, 131, 436, 131, 438, 131, 441, 711, 0, 0, 0, 713, 0, 0, 0,
/* 14195 */ 78848, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 674, 131, 131, 131, 131, 131, 131, 724, 131, 131, 726, 131, 131,
/* 14220 */ 131, 0, 131, 131, 57630, 131, 131, 131, 392, 67922, 131, 392, 393, 265, 4362, 131, 131, 408, 131, 131, 131,
/* 14241 */ 0, 131, 131, 131, 131, 686, 131, 131, 131, 131, 131, 131, 131, 738, 131, 131, 131, 131, 743, 744, 0, 0, 0,
/* 14264 */ 0, 131, 131, 756, 131, 131, 131, 131, 0, 131, 131, 131, 66846, 131, 131, 304, 131, 0, 0, 0, 0, 0, 0, 131,
/* 14288 */ 131, 131, 0, 0, 0, 0, 0, 0, 0, 357, 56606, 131, 131, 131, 131, 131, 0, 131, 131, 131, 438, 131, 131, 0, 646,
/* 14313 */ 0, 0, 0, 0, 131, 131, 131, 0, 0, 0, 0, 131, 0, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131,
/* 14338 */ 410, 131, 131, 131, 131, 131, 131, 131, 131, 0, 131, 0, 0, 131, 783, 0, 0, 100352, 196, 131, 131, 100638, 0,
/* 14361 */ 788, 131, 131, 131, 0, 0, 0, 0, 0, 659, 660, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 673, 131, 131, 131, 131, 131,
/* 14388 */ 299, 131, 131, 131, 0, 0, 0, 309, 0, 0, 131, 299, 314, 0, 0, 0, 0, 0, 0, 15360, 0, 0, 0, 0, 0, 0, 0, 0, 225,
/* 14417 */ 0, 0, 349, 196, 357, 0, 0, 0, 131, 369, 314, 131, 131, 131, 131, 131, 131, 265, 4362, 131, 131, 131, 131,
/* 14440 */ 131, 131, 292, 376, 299, 131, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 0, 131, 746, 0, 0, 0, 0, 0, 0, 0,
/* 14468 */ 196, 752, 0, 131, 473, 131, 131, 131, 131, 131, 0, 479, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 161, 0, 0, 0, 138,
/* 14495 */ 164, 0, 0, 0, 492, 0, 496, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 131, 0, 131, 131, 131, 131, 131, 131, 131, 131,
/* 14522 */ 131, 131, 131, 0, 0, 0, 0, 131, 131, 131, 645, 0, 0, 0, 0, 0, 131, 131, 131, 0, 0, 0, 0, 131, 131, 0, 131,
/* 14549 */ 131, 131, 131, 131, 131, 131, 440, 131, 515, 131, 0, 0, 595, 0, 0, 0, 0, 0, 0, 0, 131, 131, 131, 131, 131,
/* 14574 */ 131, 605, 131, 131, 0, 0, 131, 131, 131, 131, 131, 131, 131, 0, 131, 131, 764, 131, 131, 131, 414, 131, 131,
/* 14597 */ 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 628, 131, 131, 131, 131, 131, 785, 131, 0, 131, 131, 0,
/* 14619 */ 196, 131, 0, 196, 131, 196, 0, 0, 0, 0, 0, 0, 0, 385, 0, 0, 136192, 0, 136192, 0, 0, 39297, 147, 0, 0, 0, 0,
/* 14646 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 141, 141, 0, 0, 0, 0, 0, 147, 147, 147, 147, 147, 147, 147, 0, 0, 0, 0, 0,
/* 14676 */ 0, 0, 0, 0, 0, 147, 147, 0, 0, 0, 0, 0, 0, 0, 147, 147, 147, 0, 0, 0, 147, 0, 0, 147, 147, 184, 147, 147,
/* 14704 */ 147, 193, 193, 193, 193, 193, 184, 213, 213, 214, 184, 184, 184, 184, 214, 0, 184, 184, 184, 214, 184, 184,
/* 14726 */ 184, 184, 147, 147, 214, 0, 184, 147, 147, 0, 0, 0, 0, 0, 214, 214, 214, 214, 0, 131, 0, 131, 131, 131, 131,
/* 14751 */ 131, 131, 131, 131, 131, 131, 131, 131, 422, 131, 131, 131, 478, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 594, 494,
/* 14777 */ 357, 0, 597, 0, 583, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 142, 142, 410, 131, 131, 131, 131, 131, 131,
/* 14805 */ 131, 131, 131, 131, 0, 0, 0, 0, 131, 131, 0, 131, 131, 131, 131, 131, 131, 131, 506, 131, 506, 131, 508,
/* 14828 */ 131, 131, 131, 131, 131, 131, 410, 131, 131, 0, 0, 0, 0, 648, 0, 131, 131, 131, 0, 0, 0, 0, 131, 0, 0, 154,
/* 14854 */ 0, 0, 148, 148, 148, 148, 148, 148, 148, 0, 0, 0, 0, 0, 148, 148, 148, 148, 148, 0, 0, 0, 0, 0, 148, 148,
/* 14880 */ 148, 0, 0, 0, 148, 0, 0, 148, 148, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 148, 148, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/* 14912 */ 0, 0, 0, 0, 143, 143, 148, 148, 148, 148, 148, 148, 0, 148, 148, 148, 148, 148, 148, 148, 148, 148, 0, 251,
/* 14936 */ 148, 148, 0, 0, 0, 0, 0, 251, 251, 251, 251, 0, 131, 0, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131,
/* 14960 */ 131, 131, 426, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 442, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/* 14986 */ 198, 0, 0, 0, 198, 300, 131, 131, 131, 0, 0, 0, 0, 0, 0, 131, 300, 300, 0, 0, 0, 0, 0, 0, 17626, 0, 0, 0, 0,
/* 15015 */ 0, 0, 0, 0, 226, 0, 0, 0, 196, 357, 0, 0, 0, 131, 131, 300, 131, 131, 131, 131, 131, 461, 131, 131, 0, 0, 0,
/* 15042 */ 0, 0, 0, 0, 0, 131, 131, 131, 131, 131, 131, 131, 131, 580, 0, 0, 131, 395, 131, 131, 131, 131, 131, 131,
/* 15066 */ 265, 4362, 131, 131, 131, 131, 131, 131, 532, 265, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131, 131,
/* 15087 */ 380, 381, 0, 0, 0, 0, 0, 0, 0, 0, 0, 284, 131, 131, 0, 131, 275, 327, 0, 330, 0, 0, 333, 0, 0, 319, 0, 131,
/* 15115 */ 131, 131, 0, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 387, 0, 131, 0, 0, 0, 0, 0, 0, 196, 357, 0, 365, 0,
/* 15144 */ 131, 131, 131, 131, 131, 131, 280, 131, 131, 265, 4362, 131, 131, 131, 131, 131, 131, 301, 131, 131, 131, 0,
/* 15166 */ 0, 0, 0, 0, 0, 131, 301, 301, 0, 0, 0, 0, 0, 0, 22528, 0, 0, 0, 0, 0, 0, 0, 0, 227, 336, 131, 131, 131, 131,
/* 15195 */ 131, 301, 131, 131, 0, 0, 0, 0, 0, 351, 0, 0, 0, 0, 0, 140, 140, 140, 140, 155, 140, 140, 0, 0, 0, 0, 0, 0,
/* 15223 */ 0, 0, 0, 163, 140, 140, 0, 0, 0, 0, 0, 196, 357, 0, 0, 0, 131, 131, 301, 131, 131, 131, 131, 131, 611, 0, 0,
/* 15250 */ 131, 131, 131, 616, 131, 131, 131, 131, 131, 131, 511, 131, 131, 131, 131, 131, 131, 0, 0, 0, 0, 0, 0, 131,
/* 15274 */ 131, 97566, 0, 571, 0, 0, 131, 131, 378, 131, 131, 131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 131, 131, 0, 131, 131,
/* 15300 */ 131, 131, 131, 525, 460, 131, 527, 131, 131, 0, 131, 336, 131, 131, 131, 131, 131, 378, 131, 131, 131, 131,
/* 15322 */ 131, 131, 131, 635, 131, 131, 131, 131, 131, 131, 131, 0, 0, 0, 104448, 131, 131, 378, 131, 131, 131, 131,
/* 15344 */ 131, 131, 265, 4362, 131, 131, 131, 131, 131, 131, 655, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 665, 0, 131, 286, 131,
/* 15370 */ 131, 131, 131, 131, 131, 131, 131, 286, 131, 131, 0, 0, 0, 0, 0, 0, 0, 131, 131, 131, 131, 131, 131, 131, 0,
/* 15395 */ 131, 131, 131, 131, 74014, 131, 0, 131, 131, 703, 0, 704, 0, 0, 131, 0, 0, 131, 131, 0, 0, 84992, 0, 0, 0,
/* 15420 */ 131, 131, 131, 0, 0, 0, 0, 0, 0, 0, 661, 0, 0, 0, 0, 0, 196, 792, 0, 131, 131, 0, 196, 131, 0, 196, 131,
/* 15447 */ 196, 0, 0, 0, 0, 0, 0, 0, 506, 131, 131, 131, 131, 131, 131, 131, 131, 105472, 0, 105472, 105472, 0, 0, 0,
/* 15471 */ 0, 0, 105472, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 105472, 0, 105472, 105472, 105472, 0, 0, 105472, 0, 0, 0,
/* 15495 */ 105472, 0, 0, 0, 105472, 105472, 105472, 105472, 0, 0, 105472, 105472, 105472, 105472, 0, 105472, 0, 0, 0,
/* 15514 */ 0, 0, 0, 105472, 105472, 105472, 105472, 105472, 0, 136192, 0, 136192, 136192, 136192, 136192, 136192,
/* 15530 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 0, 0, 109568, 0, 0, 0, 0, 109568, 0, 0, 0, 0, 0, 0,
/* 15551 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 109568, 0, 0, 0, 0, 0, 109568, 0, 0, 109568, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
/* 15581 */ 109568, 0, 0, 0, 109568, 109568, 0, 0, 0, 109568, 109568, 109568, 109568, 0, 0, 0, 0, 109568, 109568,
/* 15600 */ 109568, 109568, 109568, 109568, 109568, 109568, 109568, 0, 136192, 0, 136192, 136192, 136192, 136192,
/* 15614 */ 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 110592, 0, 0, 0, 0, 110592, 0, 0, 0, 0, 0,
/* 15633 */ 0, 0, 110592, 110592, 110592, 110592, 0, 0, 110592, 110592, 110592, 0, 110592, 110592, 110592, 110592, 0,
/* 15650 */ 110592, 0, 136192, 0, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192, 136192,
/* 15664 */ 136192, 136192, 0, 12288, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 144, 144
};

const int Java::EXPECTED[] =
{
/*    0 */ 199, 202, 206, 210, 214, 218, 222, 226, 230, 267, 236, 243, 264, 304, 250, 254, 258, 231, 231, 394, 274, 294,
/*   22 */ 281, 287, 277, 325, 231, 293, 334, 391, 711, 285, 291, 231, 310, 396, 295, 301, 308, 231, 314, 239, 327, 232,
/*   44 */ 318, 322, 261, 331, 270, 338, 347, 360, 364, 368, 372, 376, 380, 384, 296, 388, 400, 426, 619, 549, 404, 453,
/*   66 */ 408, 296, 297, 589, 413, 437, 409, 343, 417, 296, 296, 617, 421, 425, 296, 451, 430, 296, 617, 434, 296, 451,
/*   88 */ 442, 296, 571, 438, 356, 682, 449, 705, 445, 341, 296, 296, 574, 457, 484, 462, 466, 470, 474, 478, 640, 488,
/*  110 */ 492, 496, 508, 577, 520, 524, 296, 296, 504, 516, 528, 532, 699, 539, 546, 296, 296, 481, 556, 560, 534, 564,
/*  132 */ 568, 296, 514, 583, 587, 593, 597, 579, 603, 610, 614, 542, 606, 623, 627, 631, 635, 639, 511, 644, 648, 652,
/*  154 */ 552, 656, 660, 664, 535, 670, 599, 697, 499, 677, 687, 350, 296, 296, 352, 296, 666, 697, 671, 681, 686, 296,
/*  176 */ 296, 691, 296, 695, 296, 673, 703, 296, 354, 296, 709, 502, 715, 458, 672, 717, 296, 671, 717, 296, 721, 246,
/*  198 */ 296, 750, 725, 727, 727, 731, 733, 768, 753, 726, 727, 743, 766, 741, 727, 738, 741, 747, 757, 764, 733, 760,
/*  220 */ 772, 734, 776, 782, 778, 785, 789, 793, 797, 801, 804, 1022, 1022, 1022, 1022, 1186, 1184, 852, 1187, 829,
/*  240 */ 829, 1411, 858, 1022, 1022, 1187, 829, 829, 1481, 1481, 834, 1158, 1185, 896, 1021, 823, 823, 908, 822, 907,
/*  260 */ 905, 1022, 852, 829, 1216, 815, 821, 1022, 829, 1020, 1187, 811, 853, 1024, 1023, 1024, 829, 1020, 1021,
/*  279 */ 1022, 1142, 1216, 859, 842, 817, 865, 1139, 850, 1022, 1022, 1025, 1022, 1020, 1022, 1022, 1023, 829, 829,
/*  298 */ 829, 829, 999, 1413, 863, 869, 1022, 871, 827, 1207, 1023, 1022, 1022, 1022, 1023, 1184, 853, 829, 1186,
/*  317 */ 1024, 1185, 1187, 829, 1412, 875, 1022, 853, 1022, 906, 1022, 1022, 853, 1022, 875, 1022, 1021, 1023, 829,
/*  336 */ 1021, 1186, 890, 810, 887, 829, 830, 829, 829, 1010, 1018, 967, 878, 1279, 829, 1001, 829, 829, 1204, 1281,
/*  356 */ 829, 829, 1214, 829, 1012, 828, 1186, 1121, 903, 1462, 1456, 1459, 1124, 1014, 912, 807, 893, 915, 919, 926,
/*  376 */ 930, 934, 938, 940, 922, 944, 948, 950, 954, 958, 961, 965, 1280, 829, 1161, 829, 1021, 1022, 1187, 1184,
/*  396 */ 1024, 829, 1023, 1184, 1148, 1181, 829, 1182, 984, 982, 978, 988, 973, 829, 829, 829, 1200, 1484, 1183, 1005,
/*  416 */ 1183, 1029, 829, 1147, 1034, 1163, 829, 1046, 1183, 1006, 829, 1201, 829, 829, 1312, 1030, 1147, 1162, 1164,
/*  435 */ 1483, 1448, 1199, 829, 829, 829, 1202, 1469, 1215, 1162, 829, 1201, 829, 1200, 1050, 829, 829, 1200, 829,
/*  454 */ 829, 992, 1188, 1246, 829, 829, 1283, 829, 1070, 845, 1074, 1078, 1079, 1083, 1084, 1088, 1091, 1103, 1105,
/*  473 */ 1094, 1107, 1097, 1099, 1040, 1042, 1300, 1111, 829, 1272, 1247, 1322, 1381, 1056, 1064, 1245, 1249, 1324,
/*  491 */ 1118, 966, 1128, 994, 1129, 1136, 1152, 1170, 829, 1285, 1145, 829, 1287, 829, 829, 1235, 1244, 1178, 1052,
/*  510 */ 1192, 829, 1306, 1467, 829, 1310, 1248, 1323, 1278, 881, 1232, 1172, 829, 1211, 1221, 899, 1229, 1240, 995,
/*  529 */ 1130, 995, 1130, 1316, 1256, 1196, 829, 829, 829, 1205, 1257, 1259, 1037, 829, 1354, 1358, 1174, 1264, 829,
/*  548 */ 1268, 829, 1394, 977, 829, 1166, 1058, 1060, 1277, 829, 1292, 1131, 1293, 1314, 1335, 837, 1184, 1335, 838,
/*  567 */ 1297, 1468, 1304, 1268, 829, 1449, 1330, 829, 1235, 1273, 829, 1260, 829, 829, 1114, 1066, 1320, 1328, 1328,
/*  586 */ 1334, 836, 1195, 829, 829, 1164, 1147, 1132, 1348, 1258, 1225, 1477, 1340, 829, 829, 1165, 829, 1359, 1344,
/*  605 */ 1336, 838, 1198, 1173, 1370, 1197, 829, 1346, 1350, 1223, 1476, 1364, 829, 1482, 829, 829, 971, 829, 1223,
/*  624 */ 1363, 829, 1113, 1368, 1183, 882, 838, 1224, 1112, 1374, 883, 1223, 1155, 1378, 1387, 1388, 829, 829, 829,
/*  643 */ 1236, 1382, 1465, 1399, 1383, 1392, 829, 1398, 1405, 1466, 1403, 1465, 1409, 1417, 1421, 1432, 1429, 1423,
/*  661 */ 1425, 1436, 1440, 1444, 1447, 829, 829, 1166, 829, 1282, 829, 829, 829, 1286, 829, 829, 1217, 829, 829, 846,
/*  681 */ 1146, 829, 829, 829, 1448, 1473, 829, 829, 829, 1453, 1203, 829, 1284, 829, 1160, 829, 1285, 1187, 829, 829,
/*  701 */ 1184, 1253, 1204, 829, 829, 829, 1215, 829, 1288, 829, 829, 829, 1216, 857, 1206, 829, 829, 829, 1285, 1187,
/*  721 */ 1287, 829, 1286, 829, 2097164, 1073741836, 12, 12, 12, 12, 12, 2097180, 28, 28, 28, 28, 428349436, 1048604,
/*  739 */ 28, 1074266124, 67108876, 67108876, 12, 12, 1073741852, 28, 12, 1074266140, 67108892, 28, 2060, 524300,
/*  753 */ 1048588, 67108876, 67108876, 1073741836, 67633164, 67633164, 12, 28, 1048604, 12, 524300, 68157452, 12, 28,
/*  767 */ 28, 1074266124, 524300, 524300, 68157452, 2062, 2062, 2062, 526332, 28, 429398012, 428349436, 428349436, 28,
/*  781 */ 429398012, 428349436, 28, 1505452044, 1502091260, 428349436, 428349436, -1504272356, 495458300, -430464996,
/*  791 */ -430464996, 1142423580, 2079318028, 428349436, 2146426908, 2079318044, 1073209356, 1861738508, 2146951180,
/*  800 */ 2147475468, 2146951180, 428349436, 428349436, 428349436, 4, 16, 8, 1024, 262152, 16, 0, 512, 16, 16, 256, 64,
/*  817 */ 96, 96, 96, 144, 144, 1040, 16, 144, 16, 16, 8192, 131072, 0, 0, 0, 0, (int) 0x80000000, 32768, 393216,
/*  836 */ 4194304, 33554432, 67108864, 536870912, 0, 0, 96, 64, 32, 64, 0, 0, 0, 768, 1040, 144, 16, 16, 0, 16, 16,
/*  857 */ 256, 256, 256, 256, 64, 64, 256, 32, 64, 64, 32, 64, 64, 96, 16, 16, 16777216, 268435456, 256, 256, 16, 16,
/*  879 */ 256, 1024, 262144, 0, 0, 0, 2097152, 536870912, 0, 512, 16, 512, 16, 0, 16, 262160, 131080, 16, 50331648,
/*  898 */ 805306368, 0, 0, 832, 50176, 262144, 8, 8, 8, 16, 16, 16, 144, 16, 131072, 131080, 262160, 262408, 8,
/*  917 */ 1073741840, 1073741840, 262412, 620756992, 620756992, 620757008, 1698824216, 1400753, 621019152, 620758016,
/*  927 */ 620822528, 620756992, 620823552, 620888064, 620888064, 1078067200, 1078067200, 1078067208, 1078067208,
/*  936 */ 1078067208, 620757008, 1698824192, 1698824192, 1698824208, 620757008, 620757016, 621281296, 620888080,
/*  945 */ 620757008, 1698824216, 620888080, 621543440, 620888088, 620888080, 2991950, 2991966, 1698824216, 3538943,
/*  955 */ -1484783592, 3538939, 3538943, 3801087, 4063231, 4063231, 4063231, -406716392, -272498664, -272498664,
/*  965 */ -4063208, 0, 0, 0, 4, 8, 4194304, 1610612736, 0, 0, -134217728, 0, 22528, 0, 0, 0, 224, 40960, 2097152, 0, 0,
/*  986 */ 2, 64, 63488, 8388608, 117440512, -1610612736, 12582912, -536870912, 0, 0, 4, 256, 16384, 0, 1073741824, 0,
/* 1002 */ 0, 6, 0, 0, 0, 16777216, 67108864, 536870912, 0, 16384, 0, 0, 8, 16, 134217728, 0, 64, 40960, 0, 0, 16, 16,
/* 1024 */ 16, 16, 0, 0, (int) 0x80000000, 57344, 8388608, 33554432, (int) 0x80000000, 0, 0, 0, 402653184, 0, 0, 2048,
/* 1040 */ 8192, -108706042, 8192, 8192, 8192, 8192, 134217728, 1073741824, 16777216, 67108864, 16777216, 4194304, 0, 0,
/* 1054 */ 16, 49152, 524288, 1207959552, 0, 0, 18, 18, 18, 8, 0, 32, 1, 0, 128, 32, 0, 32, 1, 2080, 0, 134217760, 0,
/* 1077 */ 2080, 1208221696, 0, 0, 1208221696, 1208221696, 0, 16859396, 16859396, 16859396, 16859396, 16859460,
/* 1089 */ 16859460, 645038160, 645038160, 645042256, 645566544, 1225081092, 661897556, 8192, 1225081092, 1225081156,
/* 1099 */ 1225081092, 10240, 10240, 662421844, 661897556, 661897556, 661897556, 1225081092, 1225081092, 1225081092,
/* 1109 */ 661897556, 1225081092, -538657, 0, 0, 0, 32768, 32768, 33554432, 524288, 1073741824, 0, 262144, 8, 0, 8,
/* 1125 */ 1024, 262152, 262152, 256, 16384, 65536, 16777216, 0, 0, 0, 131072, 320, 0, 16, 64, 64, 96, 144, 16, 144, 16,
/* 1146 */ 24, 0, 0, 0, 134217728, 0, 131072, 7340032, 637534208, 0, 0, 2048, 536870912, (int) 0x80000000, 8, 0, 0, 0,
/* 1164 */ 268435456, 0, 0, 0, 8, 0, 0, 36864, 7864320, 0, 0, 0, 1048576, 2097152, 256, 262144, 150994944, 1073741824,
/* 1182 */ 83886080, 536870912, 0, 0, 0, 16, 0, 0, 0, -402653184, 131072, 7340032, 654311424, 0, 0, 4096, 524288, 0, 0,
/* 1201 */ 0, 4194304, 0, 0, 0, 32, 0, 0, 0, 144, 6, 768, 17408, 8388608, (int) 0x80000000, 0, 0, 0, 512, 0, 956301312,
/* 1222 */ -1073741824, 0, 8192, 2048, 8192, 0, 0, 393216, 1056964608, -1073741824, 0, 0, 10240, 0, 0, 32768, 262144,
/* 1239 */ 134217728, 7, 24, 0, 960, 134217728, 1073741824, 0, 32768, 33554432, 134217728, 1, 0, 0, 49152, 131072,
/* 1255 */ 3145728, 4194304, 100663296, 536870912, 0, 0, 8192, 0, 320, 512, 8388608, 268435456, -1073741824, 1, 8, 0,
/* 1271 */ 192, 32768, 134217728, 1073741824, 0, 0, 2048, 64, 524288, 1073741824, 0, 0, 0, 1, 0, 0, 0, 2, 16, 0, 0, 0,
/* 1293 */ 4, 256, 65536, 16777216, 8192, 0, 2048, 8192, -538794, -538793, -538785, 268435456, (int) 0x80000000, 0, 0,
/* 1308 */ 32, 64, 32768, 134217728, 0, 32768, 0, 0, 16, 64, 131072, 3145728, 64, 524288, 0, 0, 128, 32, 2048, 64, 4,
/* 1329 */ 256, 16777216, 0, 4194304, 0, 64, 131072, 1048576, 2097152, 4194304, 33554432, 0, 1, 0, 192, 0, 4, 0, 131072,
/* 1348 */ 1048576, 2097152, 4194304, 67108864, 536870912, 0, 32768, 32768, 1, 128, 32, 2048, 524288, 0, 4, 0, 1, 128,
/* 1366 */ 0, 0, 2048, 0, 2097152, 67108864, 536870912, 0, 32768, 2048, 2097152, 536870912, 0, 536870912, 8192, 2048, 0,
/* 1383 */ 0, 64, 0, 64, 8192, 536870912, 0, 536870912, 0, 64, 65, 0, 0, 160, 512, 1024, 0, 0, 1, 1024, 1088, 0, 65, 64,
/* 1407 */ 1024, 64, 0, 1088, 0, 0, 512, 512, 256, 256, 18, 1042, 26, 2056, 90, 2056, 2056, 2056, 3144, 1856, 1856,
/* 1428 */ 1242, 2120, 3144, 1114, 2120, 1050, 640, 2056, 896, 2156, 896, 896, 1920, 1920, 1920, 1920, 1984, 3198, 3198,
/* 1447 */ 3198, 0, 0, 0, 16777216, 0, 0, 4, 32, 0, 0, 262144, 131072, 0, 262144, 262400, 262144, 268435456, 0, 0, 1024,
/* 1468 */ 0, 0, 0, 8388608, 33554432, 4, 32, 6, 0, 0, 8388608, 268435456, (int) 0x80000000, 2, 0, 0, 0, 1073741824,
/* 1486 */ 16777216, 67108864
};

const wchar_t *Java::TOKEN[] =
{
  L"(0)",
  L"Sub",
  L"WhiteSpace",
  L"Comment",
  L"Identifier",
  L"IntegerLiteral",
  L"FloatingPointLiteral",
  L"BooleanLiteral",
  L"CharacterLiteral",
  L"StringLiteral",
  L"'null'",
  L"EOF",
  L"'!'",
  L"'!='",
  L"'%'",
  L"'%='",
  L"'&'",
  L"'&&'",
  L"'&='",
  L"'('",
  L"')'",
  L"'*'",
  L"'*='",
  L"'+'",
  L"'++'",
  L"'+='",
  L"','",
  L"'-'",
  L"'--'",
  L"'-='",
  L"'.'",
  L"'...'",
  L"'/'",
  L"'/='",
  L"':'",
  L"';'",
  L"'<'",
  L"'<<'",
  L"'<<='",
  L"'<='",
  L"'='",
  L"'=='",
  L"'>'",
  L"'>='",
  L"'>>'",
  L"'>>='",
  L"'>>>'",
  L"'>>>='",
  L"'?'",
  L"'@'",
  L"'['",
  L"']'",
  L"'^'",
  L"'^='",
  L"'abstract'",
  L"'assert'",
  L"'boolean'",
  L"'break'",
  L"'byte'",
  L"'case'",
  L"'catch'",
  L"'char'",
  L"'class'",
  L"'continue'",
  L"'default'",
  L"'do'",
  L"'double'",
  L"'else'",
  L"'enum'",
  L"'extends'",
  L"'final'",
  L"'finally'",
  L"'float'",
  L"'for'",
  L"'if'",
  L"'implements'",
  L"'import'",
  L"'instanceof'",
  L"'int'",
  L"'interface'",
  L"'long'",
  L"'native'",
  L"'new'",
  L"'package'",
  L"'private'",
  L"'protected'",
  L"'public'",
  L"'return'",
  L"'short'",
  L"'static'",
  L"'strictfp'",
  L"'super'",
  L"'switch'",
  L"'synchronized'",
  L"'this'",
  L"'throw'",
  L"'throws'",
  L"'transient'",
  L"'try'",
  L"'void'",
  L"'volatile'",
  L"'while'",
  L"'{'",
  L"'|'",
  L"'|='",
  L"'||'",
  L"'}'",
  L"'~'"
};

int main(int argc, char **argv)
{
  return Java::main(argc, argv);
}

// End
