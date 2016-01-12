package test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.IntStream;

import org.junit.Test;

import com.google.common.collect.Lists;

public class MalcovTest {
    @Test
    public void test() {
        final List<String> keys =
                Lists.newArrayList(
                        "hoge",
                        "fuga",
                        "piyo",
                        "hogehoge",
                        "fufaufa",
                        "fuga",
                        "piyo",
                        "jjjj");
        System.out.println(MalcovHelper.process(keys));
    }

    private static class MalcovHelper {
        private static final String EOL = "EOL";

        private static String process(final List<String> keys) {
            final List<String> tmp = Lists.newArrayList(keys.get(0), keys.get(1));
            final List<String> result = new ArrayList<String>();
            String markov = null;
            while (!EOL.equals(markov)) {
                final String k1 = tmp.get(0);
                final String k2 = tmp.get(1);
                markov = new MalcovBuilder().build(keys).getValue(k1, k2);

                tmp.clear();
                tmp.add(k2);
                tmp.add(markov);
                result.add(k1);
            }
            result.addAll(tmp);
            final StringBuilder sb = new StringBuilder();
            result.forEach(v -> sb.append(v + " "));
            return sb.toString();
        }

        private static class MalcovBuilder {
            private List<MarcovVO> marcovVO;

            private MalcovBuilder() {
            }

            private MalcovBuilder build(final List<String> keys) {
                keys.add(EOL);
                final List<MarcovVO> candidate = new ArrayList<MarcovVO>();
                IntStream.range(0, keys.size() - 2).forEach(
                        i -> candidate.add(new MarcovVO(
                                keys.get(i),
                                keys.get(i + 1),
                                keys.get(i + 2))));
                marcovVO = candidate;
                return this;
            }

            private String getValue(final String key1, final String key2) {
                final List<MarcovVO> candidate = new ArrayList<MarcovVO>();
                marcovVO.stream().filter(v -> key1.equals(v.key1) && key2.equals(v.key2)).forEach(
                        v -> candidate.add(v));
                Collections.shuffle(candidate);
                return candidate.get(0).value;
            }

            private static class MarcovVO {
                public String key1;
                public String key2;
                public String value;

                private MarcovVO(final String key1, final String key2, final String value) {
                    this.key1 = key1;
                    this.key2 = key2;
                    this.value = value;
                }
            }
        }
    }
}
